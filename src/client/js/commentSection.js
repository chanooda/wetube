import "core-js/stable";
import "regenerator-runtime/runtime";

const videoCintainer = document.getElementById("video-container");
const form = document.getElementById("commentForm");
let deleteButton = document.querySelectorAll(".comment_delete_button");

const fakeComment = (text, newCommentId) => {
  const { user, avatar, userId } = form.dataset;
  //element
  const videoCommentUl = document.getElementById("video_comment_list_ul");
  const li = document.createElement("li");
  li.className = "video__commnets";
  li.dataset.id = newCommentId;
  // left box
  const video__commnetsLeft = document.createElement("div");
  video__commnetsLeft.className = "video__commnets-left";
  //img box
  const comment_img = document.createElement("div");
  comment_img.className = "comment_img";
  const img_a = document.createElement("a");
  img_a.href = `/users/${userId}`;
  const img = document.createElement("img");
  img.className = "comment_img";
  img.src = avatar;
  img.crossorigin = true;
  img_a.prepend(img);
  comment_img.prepend(img_a);
  //comment box
  const comment_text = document.createElement("div");
  comment_text.className = "comment_text";
  const text_box = document.createElement("div");
  const username_a = document.createElement("a");
  username_a.href = `/users/${userId}`;
  const span = document.createElement("span");
  span.innerText = user;
  const small = document.createElement("small");
  small.innerText = new Date().toISOString().substr(0, 10);
  const comment_text_text = document.createElement("p");
  comment_text_text.innerText = text;
  username_a.prepend(span);
  text_box.append(username_a);
  text_box.append(small);
  comment_text.append(text_box);
  comment_text.append(comment_text_text);
  video__commnetsLeft.append(img);
  video__commnetsLeft.append(comment_text);
  //right box
  const video__commnetsRight = document.createElement("div");
  video__commnetsRight.className = "video__commnets-right";
  const i = document.createElement("i");
  i.classList.add("fas");
  i.classList.add("fa-ellipsis-v");
  i.classList.add("need_drop");
  const commet_more = document.createElement("div");
  commet_more.className = "comment_more";
  const delteBtn = document.createElement("p");
  delteBtn.innerText = "Delete";
  delteBtn.className = "comment_delete_button";
  const editBtn = document.createElement("p");
  editBtn.innerText = "Edit";
  editBtn.className = "comment_edit_button";
  commet_more.append(delteBtn);
  commet_more.append(editBtn);
  video__commnetsRight.append(i);
  video__commnetsRight.append(commet_more);
  //finish
  li.append(video__commnetsLeft);
  li.append(video__commnetsRight);
  videoCommentUl.prepend(li);
  deleteButton = document.querySelectorAll(".comment_delete_button");
  deleteButton.forEach((el) => el.addEventListener("click", handleDelete));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const textarea = document.querySelector("#commentForm textarea");
  const videoId = videoCintainer.dataset.id;
  const text = textarea.value;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    const { newCommentId } = await response.json();
    textarea.value = "";
    fakeComment(text, newCommentId);
  }
};

const handleDelete = async (e) => {
  const videoId = videoCintainer.dataset.id;
  const deleteTargetId = e.target.closest(".video__commnets").dataset.id;

  const response = await fetch(`/api/comment/${deleteTargetId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ videoId }),
  });
  if (response.status === 200) {
    const { CommentId } = await response.json();
    const elm = document.querySelector(`[data-id="${CommentId}"]`);
    elm.remove();
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
deleteButton.forEach((el) => el.addEventListener("click", handleDelete));
