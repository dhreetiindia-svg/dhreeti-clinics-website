   import { createFileRoute } from "@tanstack/react-router";
   import StaffFeedbackForm from "@/components/StaffFeedbackForm";

   export const Route = createFileRoute("/feedback")({
     head: () => ({
       meta: [{ title: "Staff & Doctor Feedback | Dhreeti Clinic" }],
     }),
     component: StaffFeedbackForm,
   });
