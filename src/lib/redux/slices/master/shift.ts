import { generateMasterSlice } from "../masterState";

const shift = generateMasterSlice("shift");

export const shiftActions = shift.actions;

export default shift.reducer;
