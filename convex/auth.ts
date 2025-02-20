// import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import CustomPassword from "./CustomPassword";

// const CustomPassword = Password<DataModel>({
//   profile(params) {
//     return {
//       email: params.email as string,
//       fname: params.fname as string,
//       lname: params.lname as string,
//       role: params.role as "teacher" | "admin" | "parent",
//     }
//   }
// })

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [CustomPassword],
});