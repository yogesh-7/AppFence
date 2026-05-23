// AppFence Design System Figma Plugin — entry point

figma.showUI(__html__, { width: 320, height: 220 });

figma.ui.onmessage = async (msg: { type: string }) => {
  if (msg.type !== 'create') return;

  try {
    figma.ui.postMessage({ type: 'progress', text: 'Loading fonts…' });
    await loadFonts();

    figma.ui.postMessage({ type: 'progress', text: 'Setting up pages…' });
    setupPages();

    figma.ui.postMessage({ type: 'done', text: 'Scaffold complete.' });
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    figma.ui.postMessage({ type: 'error', text: errMsg });
  }
};

async function loadFonts(): Promise<void> {
  await Promise.all([
    figma.loadFontAsync({ family: 'Inter', style: 'Regular' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Medium' }),
    figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Bold' }),
  ]);
}

function setupPages(): void {
  const pageNames = ['🎨 Design System', '🧩 Component Library', '📱 Screens', '📦 Design Tokens'];
  while (figma.root.children.length > 1) {
    figma.root.children[figma.root.children.length - 1].remove();
  }
  figma.root.children[0].name = pageNames[0];
  for (let i = 1; i < pageNames.length; i++) {
    figma.createPage().name = pageNames[i];
  }
}
