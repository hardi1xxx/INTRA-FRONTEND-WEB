import { generateMasterSlice } from "../masterState";

const mitra = generateMasterSlice("mitra");

export const mitraActions = mitra.actions;

export default mitra.reducer;
