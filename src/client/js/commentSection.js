const videoCintainer = document.getElementById("video-container");
const form = document.getElementById("commentForm");

const handleSubmit = (e) => {
  e.preventDefault();
  const textarea = document.querySelector("#commentForm textarea");
  const videoId = videoCintainer.dataset.id;
  const text = textarea.value;
  textarea.value = "";
  if (text === "") {
    return;
  }
  const { status } = fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
  if (status === 201) {
    const videoCommentUl = document.getElementById("video_comment_list");
    const newComment = document.createElement("li");
    const img = document.createElement("img");
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
