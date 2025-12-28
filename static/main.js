
/** @type Set<HTMLElement> */
const figureParents = new Set();

let showFigureIndex = 0;

lastTime = 0;
const loop = (time) => {
  if(time - lastTime > 333) {
    showFigureIndex++
    lastTime = time;
  }

  for(const figParent of figureParents) {
    const figs = figParent.querySelectorAll("figure");
    for(const [index, fig] of figs.entries()) {
      if(index === showFigureIndex % figs.length) {
        fig.classList.add("show")
      } else {
        fig.classList.remove("show")
      }
    }
  }
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)


addEventListener("DOMContentLoaded", () => {
  const figureRotators = document.querySelectorAll(".FigureRotator")
  for(const el of figureRotators) {
    figureParents.add(el);
  }

});
