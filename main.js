'use strict';

// Make navbar transparent when it is on the top
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  if (window.scrollY > navbarHeight) {
    navbar.classList.add('navbar--dark');
  } else {
    navbar.classList.remove('navbar--dark');
  }
});

// Handle scrolling when tapping on the navbar menu
const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', event => {
  const target = event.target;
  const link = target.dataset.link;
  if (link == null) {
    return;
  }
  navbarMenu.classList.remove('open');
  scrollIntoView(link);
});

// Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');
navbarToggleBtn.addEventListener('click', () => {
  navbarMenu.classList.toggle('open');
});

// Handle click on "contact me" button on home
const homeContactBtn = document.querySelector('.home__contact');
homeContactBtn.addEventListener('click', () => {
  scrollIntoView('#contact');
});

// Make home slowly fade to transparent as the window scrolls down
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  home.style.opacity = 1 - window.scrollY / homeHeight;
});

// Show "arrow up" button when scrolling down
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
  if (window.scrollY > homeHeight / 2) {
    arrowUp.classList.add('visible');
  } else {
    arrowUp.classList.remove('visible');
  }
});

// Handle click on the "arrow up" button
arrowUp.addEventListener('click', () => {
  scrollIntoView('#home');
});

// Projects
const workBtnContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project');
workBtnContainer.addEventListener('click', e => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if (filter == null) {
    return;
  }

  // Remove selection from the previous item and select the new one
  const active = document.querySelector('.category__btn.selected');
  if (active != null) {
    active.classList.remove('selected');
  }
  e.target.classList.add('selected');

  projectContainer.classList.add('anim-out');
  setTimeout(() => {
    projects.forEach(project => {
      console.log(project.dataset.type);
      if (filter === '*' || filter === project.dataset.type) {
        project.classList.remove('invisible');
      } else {
        project.classList.add('invisible');
      }
    });
    projectContainer.classList.remove('anim-out');
  }, 300);
});



// 1. 모든 섹션 요소들과 메뉴아이템들을 가지고 온다
// 2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다
// 3. 보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다

//문자열을 배열로 저장
const sectionIds = [
  '#home',
  '#about',
  '#skills',
  '#work',
  '#education',
  '#contact',
];

//섹션요소들을 할당
const sections = sectionIds.map(id => document.querySelector(id));

//네비게이션 메뉴 아이템 요소들
const navItems = sectionIds.map(id =>
  document.querySelector(`[data-link='${id}']`)
);

//현재 선택되어 있는 내비게이션 아이디를 기억하고 있다가 다음선택이 될때 전의 것의 액티브 지우고 지금것에 active적용해줘야함 
let selectedNavIndex = 0; //인덱스
let selectedNavItem = navItems[0];//navItem 배열의 selectedNavIndex
//새로운 메뉴 아이템을 선택 할 때 마다 이전 활성화를 지워주고 새로운것에 추가
function selectNavItem(selected) {
  selectedNavItem.classList.remove('active');
  selectedNavItem = selected;
  selectedNavItem.classList.add('active');
}

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: 'smooth' });
  selectNavItem(navItems[sectionIds.indexOf(selector)])
}


const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3,
};

//콜백 함수
const observerCallback = (entries, observer) => {
  //엔트리스를 돎 해당하는 섹션을 찾아 활성화시켜줌 
  entries.forEach(entry => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
//      console.log(entry);
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      //console.log(index, entry.target.id); //인덱스, 타겟 id 출력
      // y<0이면 스크롤링이 아래로 되어서 페이지가 올라옴 , 방향 
      if (entry.boundingClientRect.y < 0) {
        selectedNavIndex = index + 1;
      } else {
        selectedNavIndex = index - 1;
      }//페이지가 내려가는 경우에는(y>0) 이전 인덱스로 지정
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);//옵저버를 만들어 해당하는 콜백과 옵션을 전달 각각의 세션들을 관찰 
sections.forEach(section => observer.observe(section));//색션스를 관찰 하면서 옵져버가 관찰 하도록

window.addEventListener('wheel', () => {//스크롤이 될때 마다
  if (window.scrollY === 0) {
    selectedNavIndex = 0;
  } else if (
    Math.round(window.scrollY + window.innerHeight) >=
    document.body.clientHeight
  ) {
    selectedNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectedNavIndex]);

});