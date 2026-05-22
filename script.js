const stack = ["Next.js", "TypeScript", "FastAPI", "Python", "PostgreSQL", "Redis", "GCP", "Docker"];

const projects = [
  {
    title: "CodeBattlegrounds",
    description:
      "A 2v2 multiplayer competetive coding platform. Players are given roles and swap mid match requiring strong communication and teamwork to win. The platform features a custom code executor with sandboxing using nsjail, real-time communication with WebSockets, and a matchmaking service utilizing Redis.",
    image: "",
    images: [
      "public/codebat/LandingPage.png",
      "public/codebat/DemoTutorial.png",
      "public/codebat/MatchmakingCreate.png",
      "public/codebat/Matchmaking.png",
      "public/codebat/TesterPOV.png",
      "public/codebat/CoderPOV.png",
      "public/codebat/Finish.png",
    ],
    liveUrl: "https://codebattlegrounds.com",
    githubUrl: "https://github.com/Capstone-Projects-2026-spring/project-code-battlegrounds-1-5",
    tags: ["Next.js", "PostgreSQL", "WebSockets", "Redis", "Docker", "GCP", "Real-Time"],
  },
  {
    title: "UFC Fight Predictor",
    description:
      "XGBoost model trained on historical UFC fight data to predict fight outcomes. The model achieved an AUC of 0.77 on a test set of recent fights, outperforming an existing PyTorch model. The project includes a web interface for users to input fighter stats and receive predictions. A kelly prediction market was also implemented to showcase if the model has an edge over betting odds. The model should not be used as a betting tool.",
    image: "",
    images: [
      "public/ufc/EventAndKelly.png",
      "public/ufc/Predictor.png",
      "public/ufc/xgb_training_curves.png",
      "public/ufc/shap_importance.png",
      "public/ufc/pytorch_training_curves.png"
    ],
    liveUrl: "https://ufcfightpredictor.com",
    githubUrl: "https://github.com/s0dl/UFC_Win_Predictor",
    tags: ["React", "FastAPI", "XGBoost", "Python", "Docker", "GCP", "Machine Learning"],
  },
  {
    title: "MTG Deck Builder",
    description:
      "MCP/RAG system that generates Magic: The Gathering decks based on user input. The web application uses OpenAI or Ollama models to create decks using a RAG database of strategy articles, meta deck lists, and card information. The MCP tools are also exposed externally so people can use them with their own agents and models. *Note: Live demo is not available due to hosting costs, but there is a video demo linked below.",
    image: "",
    images: [
      "public/mtg/Top.png",
      "public/mtg/Bottom.png",
    ],
    liveUrl: "https://youtu.be/_PU5yca2nsA",
    githubUrl: "https://github.com/s0dl/mtg-deck-builder",
    tags: ["React", "FastAPI", "MCP", "RAG", "OpenAI", "Python", "Docker", "GCP", "AI"],
  },
  {
    title: "Three Body Problem",
    description:
      "Three body problem simulater and visualizer using Next.js, React Three Fiber, and a custom RK4 integrator. Users can pick between different starting conditions to showcase special solutions and the chaotic nature of the problem.",
    image: "",
    images: [
      "public/threebody/LandingModal.png",
      "public/threebody/FigureEight.png",
      "public/threebody/LangrangePoint.png",
      "public/threebody/Butterfly.png",
      "public/threebody/Ejection.png",
    ],
    liveUrl: "https://three-body-problem-s0dl.vercel.app",
    githubUrl: "https://github.com/s0dl/three-body-problem",
    tags: ["Next.js", "React Three Fiber", "Tailwind CSS", "Zustand", "Simulation"],
  },
];

const stackList = document.getElementById("stack-list");
const projectViewport = document.getElementById("project-viewport");
const projectTrack = document.getElementById("project-track");
const projectDots = document.getElementById("project-dots");
const prevButton = document.getElementById("prev-project");
const nextButton = document.getElementById("next-project");
const year = document.getElementById("year");

let currentIndex = 0;
let autoplayTimer = null;
let mediaAutoplayTimer = null;
let lightboxProject = null;
let lightboxImageIndex = 0;
let lastFocusedElement = null;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function createLink(url, label) {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = label;
  return link;
}

function renderStack() {
  stackList.innerHTML = "";

  stack.forEach((item) => {
    const chip = document.createElement("span");
    chip.className = "stack-item";
    chip.textContent = item;
    stackList.appendChild(chip);
  });
}

function pauseAutoplay() {
  window.clearInterval(autoplayTimer);
  window.clearInterval(mediaAutoplayTimer);
}

function getProjectImages(project) {
  if (Array.isArray(project.images) && project.images.length > 0) {
    return project.images;
  }

  if (project.image) {
    return [project.image];
  }

  return [""];
}

function createLightbox() {
  const modal = document.createElement("div");
  modal.className = "lightbox";
  modal.id = "photo-lightbox";
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Project photo viewer");

  modal.innerHTML = `
    <div class="lightbox-frame">
      <button class="lightbox-close" type="button" aria-label="Close photo viewer">×</button>
      <button class="lightbox-btn lightbox-prev" type="button" aria-label="Previous photo">←</button>
      <img class="lightbox-image" alt="" />
      <button class="lightbox-btn lightbox-next" type="button" aria-label="Next photo">→</button>
      <p class="lightbox-caption"></p>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

const lightbox = createLightbox();
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxCaption = lightbox.querySelector(".lightbox-caption");
const lightboxClose = lightbox.querySelector(".lightbox-close");
const lightboxPrev = lightbox.querySelector(".lightbox-prev");
const lightboxNext = lightbox.querySelector(".lightbox-next");

function updateLightbox() {
  const images = getProjectImages(lightboxProject);
  const image = images[lightboxImageIndex];

  lightboxImage.src = image;
  lightboxImage.alt = `${lightboxProject.title} screenshot ${lightboxImageIndex + 1}`;
  lightboxCaption.textContent = `${lightboxProject.title} · ${lightboxImageIndex + 1} / ${images.length}`;
  lightboxPrev.hidden = images.length < 2;
  lightboxNext.hidden = images.length < 2;
}

function goToLightboxImage(nextIndex) {
  const images = getProjectImages(lightboxProject);
  lightboxImageIndex = (nextIndex + images.length) % images.length;
  lightboxProject.activeImageIndex = lightboxImageIndex;
  updateLightbox();
}

function openLightbox(project, imageIndex) {
  const images = getProjectImages(project);
  if (!images[imageIndex]) {
    return;
  }

  pauseAutoplay();
  lightboxProject = project;
  lightboxImageIndex = imageIndex;
  lightboxProject.activeImageIndex = imageIndex;
  lastFocusedElement = document.activeElement;
  updateLightbox();
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.removeAttribute("src");

  const projectIndex = projects.indexOf(lightboxProject);
  const activeMedia = projectTrack.children[projectIndex]?.querySelector(".project-media");
  activeMedia?.setMediaIndex?.(lightboxImageIndex);

  lightboxProject = null;

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }

  restartAutoplay();
}

function createImageSlide(project, image, index) {
  const slide = document.createElement("div");
  slide.className = "media-slide";

  if (image) {
    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = `${project.title} screenshot ${index + 1}`;
    img.src = image;
    img.addEventListener("load", updateCarousel);
    slide.appendChild(img);

    slide.type = "button";
    slide.tabIndex = 0;
    slide.setAttribute("role", "button");
    slide.setAttribute("aria-label", `Open ${project.title} screenshot ${index + 1}`);
    slide.addEventListener("click", () => openLightbox(project, index));
    slide.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(project, index);
      }
    });

    return slide;
  }

  const fallback = document.createElement("div");
  fallback.className = "placeholder";
  fallback.textContent = "Add a project image here";
  slide.appendChild(fallback);
  return slide;
}

function createProjectMedia(project) {
  const media = document.createElement("div");
  media.className = "project-media";

  const images = getProjectImages(project);
  const track = document.createElement("div");
  track.className = "media-track";
  let imageIndex = project.activeImageIndex || 0;

  images.forEach((image, index) => {
    track.appendChild(createImageSlide(project, image, index));
  });

  media.appendChild(track);

  media.setMediaIndex = (nextIndex) => {
    if (images.length < 1) {
      return;
    }

    imageIndex = (nextIndex + images.length) % images.length;
    project.activeImageIndex = imageIndex;
    track.style.transform = `translateX(-${imageIndex * 100}%)`;
  };

  media.rotateMedia = () => {
    if (images.length < 2) {
      return;
    }

    media.setMediaIndex(imageIndex + 1);
  };

  media.setMediaIndex(imageIndex);

  return media;
}

function createProjectCard(project, index) {
  const article = document.createElement("article");
  article.className = "project-card";
  article.setAttribute("aria-label", `${project.title}, project ${index + 1}`);

  const media = createProjectMedia(project);

  const body = document.createElement("div");
  body.className = "project-body";

  const indexLabel = document.createElement("p");
  indexLabel.className = "project-index";
  indexLabel.textContent = String(index + 1).padStart(2, "0");

  const title = document.createElement("h3");
  title.textContent = project.title;

  const description = document.createElement("p");
  description.textContent = project.description;

  const tagRow = document.createElement("div");
  tagRow.className = "tag-row";
  project.tags.forEach((tag) => {
    const tagEl = document.createElement("span");
    tagEl.className = "tag";
    tagEl.textContent = tag;
    tagRow.appendChild(tagEl);
  });

  const links = document.createElement("div");
  links.className = "project-links";
  links.append(createLink(project.liveUrl, "Live site"));
  links.append(createLink(project.githubUrl, "GitHub"));

  body.append(indexLabel, title, description, tagRow, links);
  article.append(media, body);

  return article;
}

function renderProjects() {
  projectTrack.innerHTML = "";
  projectDots.innerHTML = "";

  projects.forEach((project, index) => {
    projectTrack.appendChild(createProjectCard(project, index));

    const dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show project ${index + 1}`);
    dot.addEventListener("click", () => {
      goToProject(index);
      restartAutoplay();
    });
    projectDots.appendChild(dot);
  });

  updateCarousel();
}

function updateCarousel() {
  const offset = projectViewport.clientWidth * currentIndex;
  projectTrack.style.transform = `translateX(-${offset}px)`;

  const activeProject = projectTrack.children[currentIndex];
  if (activeProject) {
    projectViewport.style.height = `${activeProject.offsetHeight}px`;
  }

  Array.from(projectDots.children).forEach((dot, index) => {
    dot.classList.toggle("is-active", index === currentIndex);
    dot.setAttribute("aria-current", index === currentIndex ? "true" : "false");
  });

  restartMediaAutoplay();
}

function goToProject(index) {
  currentIndex = (index + projects.length) % projects.length;
  updateCarousel();
}

function nextProject() {
  goToProject(currentIndex + 1);
}

function prevProject() {
  goToProject(currentIndex - 1);
}

function restartMediaAutoplay() {
  window.clearInterval(mediaAutoplayTimer);

  if (lightboxProject || reducedMotion) {
    return;
  }

  const activeMedia = projectTrack.children[currentIndex]?.querySelector(".project-media");
  if (!activeMedia?.rotateMedia) {
    return;
  }

  mediaAutoplayTimer = window.setInterval(() => {
    activeMedia.rotateMedia();
  }, 3200);
}

function restartAutoplay() {
  if (lightboxProject || reducedMotion || projects.length < 2) {
    return;
  }

  pauseAutoplay();
  autoplayTimer = window.setInterval(nextProject, 5500);
  restartMediaAutoplay();
}

renderStack();
renderProjects();

prevButton.addEventListener("click", () => {
  prevProject();
  restartAutoplay();
});

nextButton.addEventListener("click", () => {
  nextProject();
  restartAutoplay();
});

lightboxClose.addEventListener("click", closeLightbox);

lightboxPrev.addEventListener("click", () => {
  goToLightboxImage(lightboxImageIndex - 1);
});

lightboxNext.addEventListener("click", () => {
  goToLightboxImage(lightboxImageIndex + 1);
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

projectTrack.addEventListener("mouseenter", pauseAutoplay);
projectTrack.addEventListener("mouseleave", restartAutoplay);
projectTrack.addEventListener("focusin", pauseAutoplay);
projectTrack.addEventListener("focusout", (event) => {
  if (!projectTrack.contains(event.relatedTarget)) {
    restartAutoplay();
  }
});

window.addEventListener("keydown", (event) => {
  if (lightboxProject) {
    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      goToLightboxImage(lightboxImageIndex - 1);
    }

    if (event.key === "ArrowRight") {
      goToLightboxImage(lightboxImageIndex + 1);
    }

    return;
  }

  if (event.target instanceof Element && event.target.closest(".project-media")) {
    return;
  }

  if (event.key === "ArrowLeft") {
    prevProject();
    restartAutoplay();
  }

  if (event.key === "ArrowRight") {
    nextProject();
    restartAutoplay();
  }
});

year.textContent = new Date().getFullYear();
restartAutoplay();

window.addEventListener("resize", updateCarousel);
