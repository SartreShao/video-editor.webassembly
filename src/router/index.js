import { createRouter, createWebHashHistory } from "vue-router";
import VideoEditor from "../views/VideoEditor.vue";

const routes = [
  {
    path: "/",
    name: "viedoeditor",
    component: VideoEditor
  },
  {
    path: "/test",
    name: "testview",
    component: () => import("../views/TestView.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
