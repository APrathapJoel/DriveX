import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getFirestore, isLiveFirestore, disableLiveFirestore } from '../config/firebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '..', '..', 'data', 'firestore_data.json');

// Graceful fallback runner for Firebase
export async function executeWithFirestoreFallback(liveAction, fallbackAction) {
  if (isLiveFirestore()) {
    try {
      return await liveAction();
    } catch (err) {
      if (err.code === 7 || err.message?.includes('Cloud Firestore API has not been used') || err.message?.includes('PERMISSION_DENIED')) {
        disableLiveFirestore('Google Cloud Firestore database has not been created yet in project drivex-c6f3f.\n👉 Visit https://console.firebase.google.com/project/drivex-c6f3f/firestore and click "Create Database".');
        return await fallbackAction();
      }
      throw err;
    }
  }
  return await fallbackAction();
}

// Memory store for local fallback
let localStore = null;

function loadLocalStore() {
  if (localStore) return localStore;
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      localStore = JSON.parse(content);
    } else {
      localStore = {};
    }
  } catch {
    localStore = {};
  }
  return localStore;
}

function saveLocalStore() {
  if (!localStore) return;
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(localStore, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save local store:', err.message);
  }
}

// Helper to generate IDs
function generateId() {
  return 'fs_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// Convert Firestore Timestamps to ISO strings / JS Dates
function normalizeFirestoreData(id, rawData) {
  if (!rawData) return null;
  const data = { ...rawData };
  data._id = id;
  data.id = id;

  for (const [key, val] of Object.entries(data)) {
    if (val && typeof val.toDate === 'function') {
      data[key] = val.toDate();
    }
  }

  if (!data.createdAt) data.createdAt = new Date().toISOString();
  if (!data.updatedAt) data.updatedAt = new Date().toISOString();
  return data;
}

// Helper to filter documents in memory
function matchesFilter(doc, filter = {}) {
  if (!filter || Object.keys(filter).length === 0) return true;

  for (const [key, condition] of Object.entries(filter)) {
    if (key === '$or' && Array.isArray(condition)) {
      const matchAny = condition.some((subFilter) => matchesFilter(doc, subFilter));
      if (!matchAny) return false;
      continue;
    }

    const docVal = doc[key];

    // If condition is regex object
    if (condition && condition.$regex) {
      const flags = condition.$options || '';
      const regex = new RegExp(condition.$regex, flags);
      if (!regex.test(String(docVal || ''))) return false;
      continue;
    }

    // If condition is comparison operator
    if (condition && typeof condition === 'object' && !Array.isArray(condition) && !(condition instanceof Date)) {
      if (condition.$in && Array.isArray(condition.$in)) {
        if (!condition.$in.includes(docVal)) return false;
      }
      if (condition.$gte !== undefined) {
        const target = condition.$gte instanceof Date ? condition.$gte.getTime() : condition.$gte;
        const current = docVal instanceof Date ? docVal.getTime() : docVal;
        if (current < target) return false;
      }
      if (condition.$lte !== undefined) {
        const target = condition.$lte instanceof Date ? condition.$lte.getTime() : condition.$lte;
        const current = docVal instanceof Date ? docVal.getTime() : docVal;
        if (current > target) return false;
      }
      if (condition.$gt !== undefined) {
        const target = condition.$gt instanceof Date ? condition.$gt.getTime() : condition.$gt;
        const current = docVal instanceof Date ? docVal.getTime() : docVal;
        if (current <= target) return false;
      }
      if (condition.$lt !== undefined) {
        const target = condition.$lt instanceof Date ? condition.$lt.getTime() : condition.$lt;
        const current = docVal instanceof Date ? docVal.getTime() : docVal;
        if (current >= target) return false;
      }
      continue;
    }

    // Direct equality (treat string/ObjectId uniformly)
    if (condition !== undefined) {
      const targetStr = condition && condition.toString ? condition.toString() : String(condition);
      const docStr = docVal && docVal.toString ? docVal.toString() : String(docVal);
      if (targetStr !== docStr) return false;
    }
  }

  return true;
}

export class ModelInstance {
  constructor(collectionName, data) {
    this._collectionName = collectionName;
    Object.assign(this, data);
    if (!this._id && this.id) this._id = this.id;
    if (!this.id && this._id) this.id = this._id;
  }

  toObject() {
    const obj = { ...this };
    delete obj._collectionName;
    return obj;
  }

  toJSON() {
    return this.toObject();
  }

  async save() {
    this.updatedAt = new Date().toISOString();
    const dataToSave = this.toObject();
    const id = this._id || this.id;

    await executeWithFirestoreFallback(
      async () => {
        const db = getFirestore();
        await db.collection(this._collectionName).doc(id).set(dataToSave, { merge: true });
      },
      async () => {
        const store = loadLocalStore();
        if (!store[this._collectionName]) store[this._collectionName] = {};
        store[this._collectionName][id] = dataToSave;
        saveLocalStore();
      }
    );
    return this;
  }

  async populate(pathName, selectFields = '') {
    const refId = this[pathName];
    if (!refId) return this;

    const idStr = typeof refId === 'object' && refId._id ? refId._id : String(refId);

    // Determine target collection
    let targetCollection = '';
    if (pathName === 'user' || pathName === 'reviewedBy') targetCollection = 'users';
    else if (pathName === 'vehicle') targetCollection = 'vehicles';
    else if (pathName === 'booking') targetCollection = 'bookings';

    if (!targetCollection) return this;

    const targetDoc = await executeWithFirestoreFallback(
      async () => {
        const db = getFirestore();
        const snap = await db.collection(targetCollection).doc(idStr).get();
        return snap.exists ? normalizeFirestoreData(snap.id, snap.data()) : null;
      },
      async () => {
        const store = loadLocalStore();
        return store[targetCollection] && store[targetCollection][idStr] ? { ...store[targetCollection][idStr] } : null;
      }
    );

    if (targetDoc) {
      if (selectFields) {
        const fields = selectFields.split(' ').filter(Boolean);
        const filtered = { _id: targetDoc._id, id: targetDoc._id };
        fields.forEach((f) => {
          filtered[f] = targetDoc[f];
        });
        this[pathName] = filtered;
      } else {
        this[pathName] = targetDoc;
      }
    }

    return this;
  }
}

export class QueryBuilder {
  constructor(collectionName, filter = {}, single = false, instanceClass = ModelInstance) {
    this.collectionName = collectionName;
    this.filter = filter;
    this.single = single;
    this.instanceClass = instanceClass;
    this._populates = [];
    this._sort = null;
    this._skip = 0;
    this._limit = null;
    this._select = null;
  }

  populate(pathName, fields = '') {
    this._populates.push({ pathName, fields });
    return this;
  }

  sort(sortObj) {
    this._sort = sortObj;
    return this;
  }

  skip(n) {
    this._skip = parseInt(n) || 0;
    return this;
  }

  limit(n) {
    this._limit = parseInt(n) || null;
    return this;
  }

  select(selectStr) {
    this._select = selectStr;
    return this;
  }

  async exec() {
    let docs = await executeWithFirestoreFallback(
      async () => {
        const result = [];
        const db = getFirestore();
        const snap = await db.collection(this.collectionName).get();
        snap.forEach((doc) => {
          const data = normalizeFirestoreData(doc.id, doc.data());
          if (matchesFilter(data, this.filter)) {
            result.push(data);
          }
        });
        return result;
      },
      async () => {
        const result = [];
        const store = loadLocalStore();
        const col = store[this.collectionName] || {};
        for (const [id, rawData] of Object.entries(col)) {
          const data = { ...rawData, _id: id, id };
          if (matchesFilter(data, this.filter)) {
            result.push(data);
          }
        }
        return result;
      }
    );

    // Sort
    if (this._sort) {
      const [field, direction] = Object.entries(this._sort)[0] || [];
      if (field) {
        const dir = direction === -1 || direction === 'desc' ? -1 : 1;
        docs.sort((a, b) => {
          let valA = a[field];
          let valB = b[field];
          if (valA instanceof Date) valA = valA.getTime();
          if (valB instanceof Date) valB = valB.getTime();
          if (typeof valA === 'string' && !isNaN(Date.parse(valA))) valA = new Date(valA).getTime();
          if (typeof valB === 'string' && !isNaN(Date.parse(valB))) valB = new Date(valB).getTime();
          if (valA == null) return 1;
          if (valB == null) return -1;
          if (valA > valB) return dir;
          if (valA < valB) return -dir;
          return 0;
        });
      }
    }

    // Skip & Limit
    if (this._skip) {
      docs = docs.slice(this._skip);
    }
    if (this._limit) {
      docs = docs.slice(0, this._limit);
    }

    if (this.single) {
      if (docs.length === 0) return null;
      const TargetClass = this.instanceClass || ModelInstance;
      const instance = new TargetClass(this.collectionName, docs[0]);
      for (const p of this._populates) {
        await instance.populate(p.pathName, p.fields);
      }
      return instance;
    }

    const instances = [];
    const TargetClass = this.instanceClass || ModelInstance;
    for (const d of docs) {
      const inst = new TargetClass(this.collectionName, d);
      for (const p of this._populates) {
        await inst.populate(p.pathName, p.fields);
      }
      instances.push(inst);
    }
    return instances;
  }

  // Make query awaitable directly
  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }
}

export class BaseFirestoreModel {
  constructor(collectionName, instanceClass = ModelInstance) {
    this.collectionName = collectionName;
    this.instanceClass = instanceClass;
  }

  async create(data) {
    const id = data._id || data.id || generateId();
    const now = new Date().toISOString();
    const docData = {
      ...data,
      _id: id,
      id,
      createdAt: data.createdAt || now,
      updatedAt: data.updatedAt || now,
    };

    await executeWithFirestoreFallback(
      async () => {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(id).set(docData);
      },
      async () => {
        const store = loadLocalStore();
        if (!store[this.collectionName]) store[this.collectionName] = {};
        store[this.collectionName][id] = docData;
        saveLocalStore();
      }
    );

    const TargetClass = this.instanceClass || ModelInstance;
    return new TargetClass(this.collectionName, docData);
  }

  async insertMany(items = []) {
    const results = [];
    for (const item of items) {
      const created = await this.create(item);
      results.push(created);
    }
    return results;
  }

  findById(id) {
    if (!id) return new QueryBuilder(this.collectionName, { _id: '__none__' }, true, this.instanceClass);
    const idStr = id.toString();
    return new QueryBuilder(this.collectionName, { _id: idStr }, true, this.instanceClass);
  }

  findOne(filter = {}) {
    return new QueryBuilder(this.collectionName, filter, true, this.instanceClass);
  }

  find(filter = {}) {
    return new QueryBuilder(this.collectionName, filter, false, this.instanceClass);
  }

  async findByIdAndUpdate(id, updates = {}, _options = {}) {
    if (!id) return null;
    const idStr = id.toString();
    const existing = await this.findById(idStr);
    if (!existing) return null;

    Object.assign(existing, updates);
    existing.updatedAt = new Date().toISOString();
    await existing.save();
    return existing;
  }

  async findByIdAndDelete(id) {
    if (!id) return null;
    const idStr = id.toString();

    await executeWithFirestoreFallback(
      async () => {
        const db = getFirestore();
        await db.collection(this.collectionName).doc(idStr).delete();
      },
      async () => {
        const store = loadLocalStore();
        if (store[this.collectionName] && store[this.collectionName][idStr]) {
          delete store[this.collectionName][idStr];
          saveLocalStore();
        }
      }
    );
    return true;
  }

  async deleteMany(filter = {}) {
    if (Object.keys(filter).length === 0) {
      await executeWithFirestoreFallback(
        async () => {
          const db = getFirestore();
          const snap = await db.collection(this.collectionName).get();
          const batch = db.batch();
          snap.forEach((doc) => batch.delete(doc.ref));
          await batch.commit();
        },
        async () => {
          const store = loadLocalStore();
          store[this.collectionName] = {};
          saveLocalStore();
        }
      );
      return { deletedCount: 0 };
    }

    const items = await this.find(filter);
    for (const item of items) {
      await this.findByIdAndDelete(item._id);
    }
    return { deletedCount: items.length };
  }

  async countDocuments(filter = {}) {
    const items = await this.find(filter);
    return items.length;
  }

  async updateMany(filter = {}, updates = {}) {
    const items = await this.find(filter);
    for (const item of items) {
      Object.assign(item, updates);
      await item.save();
    }
    return { modifiedCount: items.length };
  }

  async aggregate(pipeline = []) {
    let docs = await executeWithFirestoreFallback(
      async () => {
        const result = [];
        const db = getFirestore();
        const snap = await db.collection(this.collectionName).get();
        snap.forEach((d) => result.push(normalizeFirestoreData(d.id, d.data())));
        return result;
      },
      async () => {
        const store = loadLocalStore();
        const col = store[this.collectionName] || {};
        return Object.entries(col).map(([id, d]) => ({ ...d, _id: id, id }));
      }
    );

    for (const stage of pipeline) {
      if (stage.$match) {
        docs = docs.filter((d) => matchesFilter(d, stage.$match));
      } else if (stage.$group) {
        const groups = {};
        const { _id: idExpr, ...accumulators } = stage.$group;

        for (const doc of docs) {
          let groupId = null;
          if (typeof idExpr === 'string' && idExpr.startsWith('$')) {
            groupId = doc[idExpr.slice(1)] || null;
          } else if (idExpr && typeof idExpr === 'object' && idExpr.$dateToString) {
            const dateField = idExpr.$dateToString.date?.replace('$', '');
            const rawDate = doc[dateField];
            if (rawDate) {
              const d = new Date(rawDate);
              const month = String(d.getMonth() + 1).padStart(2, '0');
              groupId = `${d.getFullYear()}-${month}`;
            }
          }

          const groupKey = groupId == null ? 'null' : String(groupId);
          if (!groups[groupKey]) {
            groups[groupKey] = { _id: groupId };
            for (const [accKey, accExpr] of Object.entries(accumulators)) {
              groups[groupKey][accKey] = 0;
            }
          }

          for (const [accKey, accExpr] of Object.entries(accumulators)) {
            if (accExpr && accExpr.$sum !== undefined) {
              if (accExpr.$sum === 1) {
                groups[groupKey][accKey] += 1;
              } else if (typeof accExpr.$sum === 'string' && accExpr.$sum.startsWith('$')) {
                const fieldName = accExpr.$sum.slice(1);
                groups[groupKey][accKey] += Number(doc[fieldName] || 0);
              }
            }
          }
        }
        docs = Object.values(groups);
      } else if (stage.$sort) {
        const [field, dir] = Object.entries(stage.$sort)[0] || [];
        if (field) {
          const d = dir === -1 || dir === 'desc' ? -1 : 1;
          docs.sort((a, b) => (a[field] > b[field] ? d : a[field] < b[field] ? -d : 0));
        }
      } else if (stage.$limit) {
        docs = docs.slice(0, stage.$limit);
      }
    }

    return docs;
  }
}

export default BaseFirestoreModel;
