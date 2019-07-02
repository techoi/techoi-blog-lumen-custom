import React from 'react';
import Helmet from 'react-helmet';
import styles from './Layout.module.scss';

const Layout = ({ children, title, description }) => (
  <div className={styles.layout}>
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* Google Search Console */}
      <meta name="google-site-verification" content="HTZyqitny3N_5Zoo2r3UvFf44IvBf44s96xC1AU8YFI" />
      {/* Google Adsense */}
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
      <script>
        {`(adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: "ca-pub-3091812896982510",
          enable_page_level_ads: true
        });`}
      </script>
    </Helmet>
    {children}
  </div>
);

export default Layout;
