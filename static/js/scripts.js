

const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'blog', 'misc', 'recent-readings']


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    
    // Load home content normally
    fetch(content_dir + 'home.md')
        .then(response => response.text())
        .then(markdown => {
            const html = marked.parse(markdown);
            document.getElementById('home-md').innerHTML = html;
            MathJax.typeset();
        })
        .catch(error => console.log(error));
    
    // Load other sections with summary/full content
    const expandableSections = ['blog', 'misc', 'recent-readings'];
    expandableSections.forEach(name => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                // Parse full content
                const fullHtml = marked.parse(markdown);
                document.getElementById(`${name}-full`).innerHTML = fullHtml;
                
                // Create summary (first 5 lines)
                const summaryLines = markdown.split('\n').slice(0, 5);
                const summaryText = summaryLines.join('\n');
                const summaryHtml = marked.parse(summaryText);
                document.getElementById(`${name}-summary`).innerHTML = summaryHtml;
                
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    });
    
    // Add toggle button functionality
    document.querySelectorAll('.toggle-button').forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            const summary = document.getElementById(`${target}-summary`);
            const fullContent = document.getElementById(`${target}-full`);
            
            if (fullContent.style.display === 'none') {
                summary.style.display = 'none';
                fullContent.style.display = 'block';
                button.textContent = '收起';
            } else {
                summary.style.display = 'block';
                fullContent.style.display = 'none';
                button.textContent = '展开全部';
            }
        });
    });

}); 
