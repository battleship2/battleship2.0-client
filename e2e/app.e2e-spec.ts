import { Site2Page } from './app.po';

describe('site2 App', function() {
  let page: Site2Page;

  beforeEach(() => {
    page = new Site2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
