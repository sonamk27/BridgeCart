/**
 * In the real BridgeCart backend this hits:
 *   GET /api/owner/stores/{storeId}/layout/aisles/{aisleId}
 * -> LayoutController -> LayoutService -> LayoutRepository -> PostgreSQL
 *
 * It is stubbed here so the frontend shell works standalone. Swap the body
 * of this function for a real fetch() once the Spring Boot endpoint exists:
 *
 *   const res = await fetch(`/api/owner/stores/${storeId}/layout/aisles/${aisleId}`, {
 *     headers: { Authorization: `Bearer ${token}` },
 *   });
 *   return res.json();
 */
export async function fetchAisleDetail(aisle) {
  // simulate network latency so the UI can show a "syncing" state
  await new Promise(resolve => setTimeout(resolve, 450));
  return aisle;
}
export async function sendLayoutSelection(storeId, aisleId) {
  // simulate POST /api/owner/stores/{storeId}/layout/selection
  console.log(`[layoutApi] selection sent -> store=${storeId} aisle=${aisleId}`);
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    ok: true
  };
}
