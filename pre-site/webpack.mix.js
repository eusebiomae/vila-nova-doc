let mix = require('laravel-mix');
let fs = require('fs');
const config = require('./config.json');
let prod = mix.inProduction();
let sharp = require('sharp');
let sizeOf = require('image-size');
require('laravel-mix-ejs');
require('laravel-mix-copy-watched');


mix
    .setPublicPath('public')
    .options({ processCssUrls: false, terser: { extractComments: false, } })
    .ejs('source/views/**/*.ejs', 'public', config, { partials: 'source/views/components', rmWhitespace: prod })
    .js('source/assets/js/main.js', 'js')
    .sass('source/assets/scss/styles.scss', 'css')
    .copyWatched('source/assets/images/**/*.{jpg,svg,png,gif}', 'public/images', { base: 'images' })
    .copy(['source/assets/icomoon/fonts', 'source/assets/fonts'], 'public/fonts')
    .disableNotifications()
    ;


if (prod) {
    mix
        .version()
        .after(() => {
            let manifest = require('./public/mix-manifest.json');

            fs.readFile('./public/index.html', 'utf8', (err, data) => {
                if (err) return;
                let result = data
                    .replace('js/main.js', manifest['/js/main.js'].replace('/', ''))
                    .replace('css/styles.css', manifest['/css/styles.css'].replace('/', ''));

                fs.writeFile('./public/index.html', result, 'utf8', err => { if (err) return; });
            });

            fs.unlink('./public/css/styles.css.map', err => { if (err) return; });
            fs.unlink('./public/js/main.js.map', err => { if (err) return; });
            fs.rmdir('./public/views', err => { if (err) return; });
        });
} else {
    //mix.sourceMaps().webpackConfig({ devtool: 'source-map' });
}


mix.before(() => {
    config.utm = config.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ /g, '_');
    config.galerias.forEach(galeria => {
        let dir = 'source/assets/' + galeria.path;
        let dir_thumbs = dir + 'thumbs/';
        let dir_thumbs_mob = dir + 'thumbs/mob/';

        galeria.itens = [];

        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        if (!fs.existsSync(dir_thumbs)) fs.mkdirSync(dir_thumbs);
        if (!fs.existsSync(dir_thumbs_mob)) fs.mkdirSync(dir_thumbs_mob);

        fs.readdir('./' + dir, (err, files) => {
            files.forEach(function (file, i) {
                if (file.indexOf('.jpg') > -1) {

                    if (!fs.existsSync(dir_thumbs + file)) {
                        var w = galeria.size_thumb.w;
                        var h = galeria.size_thumb.h;
                        if (h == 0) {
                            sharp(dir + file).resize(w).toFile(dir_thumbs + file);
                        } else if (w == 0) {
                            sharp(dir + file).resize({ height: h }).toFile(dir_thumbs + file);
                        } else {
                            sharp(dir + file).resize(w, h).toFile(dir_thumbs + file);
                        }
                    }

                    if (!fs.existsSync(dir_thumbs_mob + file)) {
                        var w = galeria.size_thumb_mob.w;
                        var h = galeria.size_thumb_mob.h;
                        if (h == 0) {
                            sharp(dir + file).resize(w).toFile(dir_thumbs_mob + file);
                        } else if (w == 0) {
                            sharp(dir + file).resize({ height: h }).toFile(dir_thumbs_mob + file);
                        } else {
                            sharp(dir + file).resize(w, h).toFile(dir_thumbs_mob + file);
                        }
                    }

                    var dimensions = sizeOf(dir + file);
                    galeria.itens[i] = { "file": file, "w": dimensions.width, "h": dimensions.height };
                }

            });
        });

    });

})