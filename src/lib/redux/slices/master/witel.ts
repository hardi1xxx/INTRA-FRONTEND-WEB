import { generateMasterSlice } from "../masterState";

const witel = generateMasterSlice("witel");

export const witelActions = witel.actions;

export default witel.reducer;
