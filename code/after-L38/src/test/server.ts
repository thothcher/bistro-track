import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// A fake API that lives inside the test process: it catches every fetch() before it leaves the machine.
export const server = setupServer(...handlers);
