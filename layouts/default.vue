<template>
  <div>
    <aside>
        <div itemscope itemtype="http://schema.org/Person">
            <div class="author">
                <a href="/" title="Go to the home page">
                    <img src="https://www.gravatar.com/avatar/27dd30e7355a2f2740b636da145c4903?s=256" alt="Cyril Nicodeme's avatar" itemprop="image" />
                </a>
                <div>
                    <h2 itemprop="name">Cyril Nicodeme</h2>
                    <ul>
                        <li><a href="mailto:contact@cnicodeme.com" title="Contact me!" class="icon-mail" target="_blank"><span>Email</span></a></li>
                        <li><a href="https://github.com/cnicodeme" title="View my Github profile" class="icon-github" target="_blank"><span>Github</span></a></li>
                        <li><a href="https://twitter.com/cx42net" title="View my Twitter profile" class="icon-twitter" target="_blank"><span>Twitter</span></a></li>
                        <li><a href="https://linkedin.com/cyrilnicodeme" title="View my LinkedIn profile" class="icon-linkedin" target="_blank"><span>LinkedIn</span></a></li>
                    </ul>
                </div>
            </div>
            <nav>
                <ul itemscope itemtype="http://schema.org/SiteNavigationElement">
                    <nuxt-link to="/about" tag="li" active-class="active"><a title="About me">About</a></nuxt-link>
                    <nuxt-link to="/" tag="li" active-class="active" exact><a title="Read my posts">Posts</a></nuxt-link>
                    <nuxt-link to="/archives" tag="li" active-class="active"><a title="Go through the archives">Archives</a></nuxt-link>
                </ul>
            </nav>
        </div>
    </aside>
    <main>
        <nuxt />
    </main>
  </div>
</template>

<style>

</style>
