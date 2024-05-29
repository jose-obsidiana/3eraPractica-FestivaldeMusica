
const {src, dest, watch, parallel} = require('gulp');

// Dependencias de CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');


// Dependencias de Imágenes
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const webp = require('gulp-webp');
const avif = require('gulp-avif')

// Dependencias de Javascript
const terser = require('gulp-terser-js');




function css(done) {
    src('src/scss/**/*.scss')        // Identificar el archivo .SCSS a compilar
       .pipe( plumber())
       .pipe( sass() )              // Compilarlo
       .pipe ( postcss ([autoprefixer(), cssnano() ]) )
       .pipe( dest('build/css'));  // Almacenarlo en el disco duro
    done(); // finalizamos la tarea.
};

function imagenes(done) {
    const opciones = {        
        optimizationLevel: 3  // Aquí le especifico el nivel de optimización que quiero darles.
    }; 
    src('src/img/**/*.{png,jpg}')           // Localiza la ubicación de las imágenes
        .pipe ( cache (imagemin(opciones)) )   // Optimiza las imágenes, es decir que las hace más ligeras!
        .pipe (dest ('build/img') )           // Le especifico donde quiero que me las guarde...

    done();
}

function versionWebp(done) {
    const opciones = {     // Le especifico la calidad a la que quiero cambiar, esta opción va de 0 a 100.
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')   // Localiza la ubicación de las imágenes
        .pipe ( webp(opciones) )       // Las convierte a formato 'webp'
        .pipe ( dest('build/img') )   // Le especifico DONDE quiero que me almacene estas imágenes nuevas.

    done();
}

function versionAvif(done) {
    const opciones = {     
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')   
        .pipe ( avif(opciones) )      
        .pipe ( dest('build/img') )  

    done();
}

function javascript(done) {
    src('src/js/**/*.js')

        .pipe ( terser() )
        .pipe( dest('build/js') );

        done();
}

function dev(done) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    done();
};


exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel (imagenes, versionWebp, versionAvif, javascript, dev);