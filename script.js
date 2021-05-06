showTime();

let searchBars = document.querySelectorAll('form.search')
searchBars.forEach(bar => {
    bar.addEventListener('submit', (e) => {
        e.preventDefault();
        let input = bar.querySelector('input');
        let options = "";
        let selects = bar.querySelectorAll('select');
        selects.forEach(select => {
            options += select.value;
        });
        let baseUrl = input.dataset.baseUrl;
        let link = document.createElement('a');
        link.href = baseUrl + encodeURIComponent(input.value) + options;
        link.click();
    })
});

let directories = document.querySelectorAll('.directory');
directories.forEach(directory => {
    let form = directory.querySelector('form');
    let filter = directory.querySelector('[placeholder=Filter]');
    let filterUrls;
    if (filter.dataset.filterUrls) filterUrls = filter.dataset.filterUrls.split(',');
    let searchUrl = filter.dataset.searchUrl;
    let links = directory.querySelectorAll('a');

    for (let i = 0; i < links.length; i++) {
        let style = window.getComputedStyle(links[i])
        let lineHeight = parseFloat(style.lineHeight)
        let vPadding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
        let singleLineHeight = lineHeight + vPadding
        if (links[i].clientHeight > singleLineHeight) {
            directory.parentElement.classList.add('stretchy')
            break
        }
    }

    filter.addEventListener('input', () => {
        let visibleGroups = directory.querySelectorAll('.visible.group');
        let matchedLinks = directory.querySelectorAll('.match');
        visibleGroups.forEach(group => {
            group.classList.remove('visible');
        });
        matchedLinks.forEach(li => {
            li.classList.remove('match');
        });

        if (filter.value !== '') {
            directory.classList.add('filtering');
            let queries = [];
            queries.push(new RegExp(escRegExp(filter.value), 'i'));
            if (filterUrls) {
                filterUrls.forEach(url => {
                    queries.push(new RegExp(escRegExp(url + filter.value), 'i'))
                });
            }
            links.forEach(link => {
                let group = link.parentElement.parentElement.parentElement;
                let li = link.parentElement;
                queries.forEach(query => {
                    if (query.test(link.href) || query.test(link.innerText)) {
                        li.classList.add('match');
                        group.classList.add('visible');
                    }
                })
            })
        } else {
            setTimeout(() => { directory.classList.remove('filtering') }, 200);
        }
    })

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let matches = directory.querySelectorAll('li.match');
        if (matches.length === 1) {
            let link = matches[0].querySelector('a');
            link.click();
        }
        if (matches.length === 0) {
            let link = document.createElement('a');
            link.href = searchUrl + encodeURIComponent(filter.value);
            link.click();
        }
    })
})


function showTime() {
    let ref = new Date();

    let hr = ref.getHours();
    let mi = ref.getMinutes();
    mi = (mi < 10) ? '0' + mi : mi;
    let time = hr + ':' + mi;

    let wd = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(ref);
    let dm = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(ref);
    let mn = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(ref);
    let yr = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(ref);

    document.getElementById('time').innerText = time;
    document.getElementById('date').innerText = wd + ' ' + dm + ' ' + mn + ' ' + yr;
    setTimeout(showTime, 1000);
}
function escRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function expand(element) {
    let group = element.parentElement;
    group.classList.toggle('expanding');
    group.classList.toggle('visible');
    setTimeout(() => { group.classList.toggle('expanding') }, 200);
}