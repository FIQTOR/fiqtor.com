import { describe, expect, it } from 'vitest';
import { Projects, BestProjects, RecentProjects } from './projects';

/**
 * Regression guard for a shipped bug: image paths in the project data were
 * authored inconsistently — some without a leading slash. A `src` like
 * `img/projects/x.webp` is a RELATIVE URL, so on `/projects/` the browser
 * resolved it to `/projects/img/projects/x.webp` and the image 404'd. It
 * only "worked" on `/`. `Projects` now normalizes every path to absolute.
 *
 * Docs: https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Images_in_HTML
 */

const isAbsoluteAssetPath = (src: string): boolean =>
  src.startsWith('/') || /^[a-z]+:\/\//i.test(src);

describe('project image paths', () => {
  it('normalizes every srcImage to an absolute URL', () => {
    for (const project of Projects) {
      expect(
        isAbsoluteAssetPath(project.srcImage),
        `${project.title.en} → srcImage "${project.srcImage}" must start with "/"`,
      ).toBe(true);
    }
  });

  it('normalizes every gallery image to an absolute URL', () => {
    for (const project of Projects) {
      for (const image of project.images ?? []) {
        expect(
          isAbsoluteAssetPath(image),
          `${project.title.en} → gallery image "${image}" must start with "/"`,
        ).toBe(true);
      }
    }
  });

  it('keeps the derived highlight lists normalized too', () => {
    for (const project of [...BestProjects, ...RecentProjects]) {
      expect(isAbsoluteAssetPath(project.srcImage)).toBe(true);
    }
  });

  it('does not double-prefix paths that were already absolute', () => {
    for (const project of Projects) {
      expect(project.srcImage.startsWith('//')).toBe(false);
    }
  });

  it('still references real files under /img/projects', () => {
    const sample = Projects.find((p) =>
      p.srcImage.includes('lintas-rent'),
    );
    expect(sample?.srcImage).toBe('/img/projects/lintas-rent.webp');
  });
});
