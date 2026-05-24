export const defaultLang = 'en' as const;
export type Lang = 'en' | 'vi';

export const ui = {
  en: {
    // Nav
    'nav.blog': 'Blog',
    'nav.topics': 'Topics',
    'nav.about': 'About',
    // Hero
    'hero.kicker': 'Personal blog',
    'hero.read': 'Read the blog',
    'hero.about': 'About me',
    'hero.badge.webdev': 'Web Development',
    'hero.badge.ai': 'Automation & Testing',
    'hero.badge.oss': 'AI Agents',
    // Homepage sections
    'home.latest': 'Latest posts',
    'home.all': 'All posts →',
    // Post listing
    'post.title': 'Blog',
    'post.count': (n: number) => `${n} ${n === 1 ? 'post' : 'posts'}`,
    // Post detail
    'post.back': 'All posts',
    'post.updated': 'Updated',
    'post.topics': 'Topics',
    // Tags
    'tags.title': 'Tags',
    'tags.subtitle': (topics: number, posts: number) => `${topics} topics · ${posts} posts`,
    'tags.back': '← All tags',
    'tags.post.count': (n: number) => `${n} ${n === 1 ? 'post' : 'posts'}`,
    // About
    'about.title': 'About',
    'about.lead': 'Software engineer focused on web development, AI integration, and testing automation. This is where I share what I learn.',
    'about.h2.intro': 'Hi, I\'m Binh Tran',
    'about.p1': 'I\'m a software engineer who cares deeply about build quality, developer experience, and the craft of writing reliable software. I spend most of my time working on web applications, designing test strategies, and exploring how AI can augment the way we build and ship software.',
    'about.p2': 'This blog is a running log of things I\'ve learned — patterns that clicked, tools that surprised me, and ideas worth writing down. I prefer depth over breadth, so most posts are practical and code-heavy.',
    'about.h2.topics': 'What I write about',
    'about.topic.webdev': 'Web Development',
    'about.topic.webdev.desc': 'Modern frameworks, performance, and frontend architecture',
    'about.topic.ai': 'AI & Automation',
    'about.topic.ai.desc': 'LLM integration, AI agents, and intelligent testing pipelines',
    'about.topic.testing': 'Testing Engineering',
    'about.topic.testing.desc': 'E2E testing with Playwright, test strategy, and quality at scale',
    'about.topic.oss': 'Open Source',
    'about.topic.oss.desc': 'Tooling, libraries, and contributing to the ecosystem',
    'about.h2.contact': 'Get in touch',
    'about.contact.p': 'Feel free to reach out — I\'m always happy to talk about engineering, ideas, or collaboration.',
    'about.facts.title': 'Quick facts',
    'about.facts.role': 'Role',
    'about.facts.role.val': 'Software Engineer',
    'about.facts.focus': 'Focus',
    'about.facts.focus.val': 'Web, AI, Testing',
    'about.facts.stack': 'Stack',
    'about.facts.stack.val': 'TypeScript, Node, Playwright',
    'about.facts.site': 'Site',
    'about.facts.site.val': 'Built with Astro',
    // Footer
    'footer.nav': 'Navigation',
    'footer.resources': 'Resources',
    'footer.blog': 'Blog',
    // 404
    '404.title': 'Page not found',
    '404.desc': "The page you're looking for doesn't exist or has been moved.",
    '404.home': 'Go home',
    '404.posts': 'Browse posts',
  },
  vi: {
    // Nav
    'nav.blog': 'Bài viết',
    'nav.topics': 'Chủ đề',
    'nav.about': 'Giới thiệu',
    // Hero
    'hero.kicker': 'Blog cá nhân',
    'hero.read': 'Đọc blog',
    'hero.about': 'Về tôi',
    'hero.badge.webdev': 'Web Development',
    'hero.badge.ai': 'Automation & Testing',
    'hero.badge.oss': 'AI Agents',
    // Homepage sections
    'home.latest': 'Bài viết mới nhất',
    'home.all': 'Tất cả bài viết →',
    // Post listing
    'post.title': 'Bài viết',
    'post.count': (n: number) => `${n} bài viết`,
    // Post detail
    'post.back': 'Tất cả bài viết',
    'post.updated': 'Cập nhật',
    'post.topics': 'Chủ đề',
    // Tags
    'tags.title': 'Chủ đề',
    'tags.subtitle': (topics: number, posts: number) => `${topics} chủ đề · ${posts} bài viết`,
    'tags.back': '← Tất cả chủ đề',
    'tags.post.count': (n: number) => `${n} bài viết`,
    // About
    'about.title': 'Giới thiệu',
    'about.lead': 'Kỹ sư phần mềm tập trung vào phát triển web, tích hợp AI và tự động hóa kiểm thử. Đây là nơi tôi chia sẻ những gì tôi học được.',
    'about.h2.intro': 'Xin chào, tôi là Binh Tran',
    'about.p1': 'Tôi là một kỹ sư phần mềm quan tâm sâu sắc đến chất lượng xây dựng, trải nghiệm lập trình viên và nghề viết phần mềm đáng tin cậy. Phần lớn thời gian tôi làm việc với các ứng dụng web, thiết kế chiến lược kiểm thử và khám phá cách AI có thể hỗ trợ quy trình phát triển phần mềm.',
    'about.p2': 'Blog này là nhật ký ghi lại những điều tôi đã học — những pattern hiệu quả, những công cụ thú vị và những ý tưởng đáng viết xuống. Tôi thích đi sâu hơn là rộng, nên phần lớn các bài viết đều thực tế và nhiều code.',
    'about.h2.topics': 'Tôi viết về gì',
    'about.topic.webdev': 'Phát triển Web',
    'about.topic.webdev.desc': 'Framework hiện đại, hiệu năng và kiến trúc frontend',
    'about.topic.ai': 'AI & Tự động hóa',
    'about.topic.ai.desc': 'Tích hợp LLM, AI agents và pipeline kiểm thử thông minh',
    'about.topic.testing': 'Kỹ thuật Kiểm thử',
    'about.topic.testing.desc': 'Kiểm thử E2E với Playwright, chiến lược test và chất lượng quy mô lớn',
    'about.topic.oss': 'Mã nguồn mở',
    'about.topic.oss.desc': 'Công cụ, thư viện và đóng góp cho cộng đồng',
    'about.h2.contact': 'Liên hệ',
    'about.contact.p': 'Hãy liên hệ — tôi luôn sẵn sàng trao đổi về kỹ thuật, ý tưởng hoặc hợp tác.',
    'about.facts.title': 'Thông tin nhanh',
    'about.facts.role': 'Vai trò',
    'about.facts.role.val': 'Kỹ sư phần mềm',
    'about.facts.focus': 'Lĩnh vực',
    'about.facts.focus.val': 'Web, AI, Kiểm thử',
    'about.facts.stack': 'Stack',
    'about.facts.stack.val': 'TypeScript, Node, Playwright',
    'about.facts.site': 'Website',
    'about.facts.site.val': 'Xây dựng với Astro',
    // Footer
    'footer.nav': 'Điều hướng',
    'footer.resources': 'Tài nguyên',
    'footer.blog': 'Bài viết',
    // 404
    '404.title': 'Không tìm thấy trang',
    '404.desc': 'Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển đến địa chỉ khác.',
    '404.home': 'Về trang chủ',
    '404.posts': 'Xem bài viết',
  },
} as const;

export type UiKey = keyof typeof ui[typeof defaultLang];
