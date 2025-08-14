import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Favorite } from "@/types"

interface FavoritesState {
  items: Favorite[]
  loading: boolean
  error: string | null
  // Backup map used for optimistic updates to enable rollback on failure
  optimisticBackup?: Record<string, string | null> | null
}

const initialState: FavoritesState = { items: [], loading: false, error: null, optimisticBackup: null }

export const fetchFavorites = createAsyncThunk("favorites/fetch", async (userId: string) => {
  const res = await fetch(`/api/favorites?userId=${userId}`)
  if (!res.ok) throw new Error("Failed to fetch favorites")
  return res.json()
})

export const addToFavorites = createAsyncThunk("favorites/add", async ({ userId, productId, categoryId, preview }: { userId: string; productId: string; categoryId: string; preview?: string | null }) => {
  const res = await fetch(`/api/favorites`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, productId, categoryId, preview }) })
  if (!res.ok) throw new Error("Failed to add favorite")
  return res.json()
})

export const removeFromFavorites = createAsyncThunk("favorites/remove", async ({ userId, productId }: { userId: string; productId: string }) => {
  const res = await fetch(`/api/favorites/${productId}?userId=${userId}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to remove favorite")
  return { userId, productId }
})

export const applyDesignToFavorites = createAsyncThunk("favorites/applyDesign", async ({ userId, categoryId, designId }: { userId: string; categoryId: string; designId?: string }) => {
  const res = await fetch(`/api/favorites/apply`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, categoryId, designId }) })
  if (!res.ok) throw new Error("Failed to apply design")
  return { userId, categoryId, designId: designId || null }
})

export const setDesignForFavoriteThunk = createAsyncThunk("favorites/setDesignForFavorite", async ({ userId, productId, designId }: { userId: string; productId: string; designId?: string | null }) => {
  const res = await fetch(`/api/favorites/set`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, productId, designId }) })
  if (!res.ok) throw new Error("Failed to set design for favorite")
  return { userId, productId, designId: designId || null }
})

const slice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    // Optional manual optimistic reducer if needed elsewhere
    optimisticApplyToCategory: (state, action) => {
      const { categoryId, designId } = action.payload as { categoryId: string; designId: string | null }
      console.log("🔥 [favoritesSlice] optimisticApplyToCategory start:", { categoryId, designId })
      // Backup current values for rollback
      const backup: Record<string, string | null> = {}
      state.items = state.items.map((fav) => {
        if (fav.categoryId === categoryId) {
          backup[fav.id] = fav.appliedDesignId ?? null
          return { ...fav, appliedDesignId: designId }
        }
        return fav
      })
      state.optimisticBackup = backup
    }
  },
  extraReducers: (b) => {
    b.addCase(fetchFavorites.pending, (s) => { s.loading = true; s.error = null })
     .addCase(fetchFavorites.fulfilled, (s, a) => { s.loading = false; s.items = a.payload })
     .addCase(fetchFavorites.rejected, (s, a) => { s.loading = false; s.error = a.error.message || null })
     .addCase(addToFavorites.fulfilled, (s, a) => { s.items.push(a.payload) })
     .addCase(removeFromFavorites.fulfilled, (s, a) => { s.items = s.items.filter((f) => f.productId !== a.payload.productId || f.userId !== a.payload.userId) })
      // Optimistic update on apply start
      .addCase(applyDesignToFavorites.pending, (s, a: any) => {
        const { categoryId, designId } = a.meta.arg as { categoryId: string; designId?: string | null }
        console.log("🔥 [favoritesSlice] applyDesignToFavorites.pending - optimistic update", { categoryId, designId })
        const backup: Record<string, string | null> = {}
        s.items = s.items.map((fav) => {
          if (fav.categoryId === categoryId) {
            backup[fav.id] = fav.appliedDesignId ?? null
            return { ...fav, appliedDesignId: designId || null }
          }
          return fav
        })
        s.optimisticBackup = backup
      })
     .addCase(applyDesignToFavorites.fulfilled, (s, a) => {
        console.log("🔥 [favoritesSlice] applyDesignToFavorites.fulfilled - confirmed", a.payload)
        s.items = s.items.map((f) => f.categoryId === a.payload.categoryId ? { ...f, appliedDesignId: a.payload.designId || null } : f)
        s.optimisticBackup = null
     })
      .addCase(applyDesignToFavorites.rejected, (s, a: any) => {
        const { categoryId } = a.meta.arg as { categoryId: string }
        console.log("🔥 [favoritesSlice] applyDesignToFavorites.rejected - rollback", { categoryId, error: a.error?.message })
        if (s.optimisticBackup) {
          s.items = s.items.map((fav) => {
            if (fav.categoryId === categoryId && s.optimisticBackup && fav.id in s.optimisticBackup) {
              return { ...fav, appliedDesignId: s.optimisticBackup[fav.id] ?? null }
            }
            return fav
          })
        }
        s.optimisticBackup = null
        s.error = a.error?.message || "Failed to apply design"
      })
      .addCase(setDesignForFavoriteThunk.pending, (s, a: any) => {
        const { userId, productId, designId } = a.meta.arg as { userId: string; productId: string; designId?: string | null }
        console.log("🔥 [favoritesSlice] setDesignForFavoriteThunk.pending - optimistic", { userId, productId, designId })
        const backup: Record<string, string | null> = {}
        s.items = s.items.map((fav) => {
          if (fav.userId === userId && fav.productId === productId) {
            backup[fav.id] = fav.appliedDesignId ?? null
            return { ...fav, appliedDesignId: designId || null }
          }
          return fav
        })
        s.optimisticBackup = backup
      })
     .addCase(setDesignForFavoriteThunk.fulfilled, (s, a) => {
        console.log("🔥 [favoritesSlice] setDesignForFavoriteThunk.fulfilled - confirmed", a.payload)
        s.items = s.items.map((f) => (f.userId === a.payload.userId && f.productId === a.payload.productId) ? { ...f, appliedDesignId: a.payload.designId || null } : f)
        s.optimisticBackup = null
     })
      .addCase(setDesignForFavoriteThunk.rejected, (s, a: any) => {
        const { userId, productId } = a.meta.arg as { userId: string; productId: string }
        console.log("🔥 [favoritesSlice] setDesignForFavoriteThunk.rejected - rollback", { userId, productId, error: a.error?.message })
        if (s.optimisticBackup) {
          s.items = s.items.map((fav) => {
            if (fav.userId === userId && fav.productId === productId && fav.id in (s.optimisticBackup as any)) {
              return { ...fav, appliedDesignId: (s.optimisticBackup as any)[fav.id] ?? null }
            }
            return fav
          })
        }
        s.optimisticBackup = null
        s.error = a.error?.message || "Failed to set design for favorite"
      })
  }
})

export const { optimisticApplyToCategory } = slice.actions
export default slice.reducer

