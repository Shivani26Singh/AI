import { openDB } from "idb";

const DB_NAME = "job-tracker-ai";
const DB_VERSION = 4;
const JOB_STORE = "jobs";

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (db.objectStoreNames.contains(JOB_STORE)) {
      db.deleteObjectStore(JOB_STORE);
    }
    const store = db.createObjectStore(JOB_STORE, { keyPath: "id" });
    store.createIndex("status", "status");
    store.createIndex("companyName", "companyName");
    store.createIndex("role", "role");
    store.createIndex("priority", "priority");
    store.createIndex("archived", "archived");
    store.createIndex("deleted", "deleted");
    store.createIndex("followUpDate", "followUpDate");
    store.createIndex("resumeUsed", "resumeUsed");
  },
});

export async function getAllJobs() {
  return (await dbPromise).getAll(JOB_STORE);
}

export async function saveJob(job) {
  await (await dbPromise).put(JOB_STORE, job);
  return job;
}

export async function saveJobs(jobs) {
  const db = await dbPromise;
  const tx = db.transaction(JOB_STORE, "readwrite");
  for (const job of jobs) {
    await tx.store.put(job);
  }
  await tx.done;
}

export async function deleteJob(id) {
  await (await dbPromise).delete(JOB_STORE, id);
}

export async function replaceJobs(jobs) {
  const db = await dbPromise;
  const tx = db.transaction(JOB_STORE, "readwrite");
  await tx.store.clear();
  for (const job of jobs) {
    await tx.store.put(job);
  }
  await tx.done;
  return jobs;
}

export async function archiveJobs(ids) {
  const db = await dbPromise;
  const tx = db.transaction(JOB_STORE, "readwrite");
  for (const id of ids) {
    const job = await tx.store.get(id);
    if (job) {
      job.archived = true;
      job.updatedAt = new Date().toISOString();
      await tx.store.put(job);
    }
  }
  await tx.done;
}

export async function restoreJob(id) {
  const db = await dbPromise;
  const job = await db.get(JOB_STORE, id);
  if (job) {
    job.archived = false;
    job.updatedAt = new Date().toISOString();
    await db.put(JOB_STORE, job);
  }
  return job;
}

export async function getJobCount() {
  return (await dbPromise).count(JOB_STORE);
}
