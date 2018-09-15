'use stict';

const views = [];

function shouldHandle(viewId) {
  const lastView = views[views.length - 1];
  if (lastView && lastView.viewId === viewId) {
    return true;
  }

  return false;
}

// eslint-disable-next-line no-unused-vars
function viewIn(viewId = (Math.random() * 1e16).toString(36), update) {
  views.push({viewId, update});
  return viewId;
}

// eslint-disable-next-line no-unused-vars
function viewOut(viewId) {
  if (shouldHandle(viewId)) {
    const lastView = views.pop();
    if (lastView && lastView.update) {
      lastView.update();
    }
  }

  return null;
}
