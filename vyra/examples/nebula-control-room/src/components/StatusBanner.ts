import Component from '@vyra/component';

export const StatusBanner = new Component(`
  <section class="banner">
    <p class="banner__tag">Current View</p>
    <h2>{{state.statusBannerTitle}}</h2>
    <p>{{state.statusBannerCopy}}</p>
  </section>
`);