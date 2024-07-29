// Configuring the Express application to use Handlebars as the template engine with '.hbs' as the extension
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',              // Set the file extension for Handlebars templates to '.hbs'
    defaultLayout: 'main',        // Specify the default layout template to be 'main'
    helpers: {
        // Defining a helper named 'navLink' to generate navigation links
        navLink: function(url, options) {
            return '<li' +
                // If the URL matches the current active route, then add the 'active' class to the list item
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        // Defining a helper named 'equal' to compare two values
        equal: function(lvalue, rvalue, options) {
            // Checking if the correct number of arguments are provided or not
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            // If the values are not equal, then  return the (else block)
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                // If the values are equal then return the main block
                return options.fn(this);
            }
        }
    }
}));

// Setting Handlebars ('.hbs') as the view engine for the application
app.set('view engine', '.hbs');
