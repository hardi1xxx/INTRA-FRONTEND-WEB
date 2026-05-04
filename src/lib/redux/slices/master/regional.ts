import { generateMasterSlice } from "../masterState";

const regional = generateMasterSlice("regional");

export const regionalActions = regional.actions;

export default regional.reducer;
