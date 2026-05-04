import { generateMasterSlice } from "../masterState";

const area = generateMasterSlice("area");

export const areaActions = area.actions;

export default area.reducer;
