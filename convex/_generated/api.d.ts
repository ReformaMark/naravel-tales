/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as achievements from "../achievements.js";
import type * as auth from "../auth.js";
import type * as classes from "../classes.js";
import type * as CustomPassword from "../CustomPassword.js";
import type * as http from "../http.js";
import type * as inquiries from "../inquiries.js";
import type * as parents from "../parents.js";
import type * as progress from "../progress.js";
import type * as quiz from "../quiz.js";
import type * as resendOTP from "../resendOTP.js";
import type * as seed from "../seed.js";
import type * as stories from "../stories.js";
import type * as storyCategories from "../storyCategories.js";
import type * as storyLanguages from "../storyLanguages.js";
import type * as students from "../students.js";
import type * as upload from "../upload.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  achievements: typeof achievements;
  auth: typeof auth;
  classes: typeof classes;
  CustomPassword: typeof CustomPassword;
  http: typeof http;
  inquiries: typeof inquiries;
  parents: typeof parents;
  progress: typeof progress;
  quiz: typeof quiz;
  resendOTP: typeof resendOTP;
  seed: typeof seed;
  stories: typeof stories;
  storyCategories: typeof storyCategories;
  storyLanguages: typeof storyLanguages;
  students: typeof students;
  upload: typeof upload;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
