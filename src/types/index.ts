import { Doc } from "../../convex/_generated/dataModel";

export interface TestimonialProps {
  avatarSrc: string;
  quote: string;
  author: string;
  role: string;
}

export interface UserSidebarType {
  fname: string;
  lname: string;
  email: string;
  avatar: string;
}


export type QuizType = Doc<"quiz">;
