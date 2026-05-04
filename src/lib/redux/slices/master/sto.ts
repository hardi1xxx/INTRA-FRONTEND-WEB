import { generateMasterSlice } from "../masterState";

const sto = generateMasterSlice("sto");

export const stoActions = sto.actions;

export default sto.reducer;
