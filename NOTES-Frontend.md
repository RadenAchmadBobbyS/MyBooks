## setup project

    npm create vite@latest
    project name: client or ? => React => Javascript

      cd client
      npm install
      npm run dev

    npm i axios react-router
    clean up ...
    create path endpoints router
    with <BrowserRouter> <Routes> <Route>

    create project from start to finish / abstraksi
    get bootstrap for layout or tailwind-cli

// tailwind installation

    npm install tailwindcss @tailwindcss/vite, plugins: [tailwindcss()]

// add to config

    import tailwindcss from '@tailwindcss/vite'
    npm i -D daisyui@latest

    @import "tailwindcss";
    @plugin "daisyui";

// using tailwind in html

    <link href="/src/styles.css" rel="stylesheet">

// else

    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    transfrom html to jsx

## register section

    setEmail & setPassword with use state ""
    handle register & jangan lupa event prevent default

    copy path from the server to handle async await axios.post/get/put/delete

    gunakan navigate untuk redirect page

    jangan lupa value ? the set email/password with on change event target value

## handle error

    sweet alert untuk handle error
    npm i sweetalert2 : A modal with a title, an error icon, a text, tidak pakai footer
    letak error: error/err -> response -> data -> message

## lc 2 information

    add data => tambahkan favorit / list favorit di Home Page
    get data favorit / menampilkan list favorit / table
    undraw.co , gambar animasi

    utk page home di card
    bisa ambil dengan props yang dikirim dari page fav
    update favorite / update product => id keranjang belanja? : id product
    panggil use state array/boolen favorit or set nya
    update status dengan negasi
    dan bisa remove favorite dengan validasi set ? update status && on remove dari id (didalam handle)

    jika tidak dengan props
    buat fetch item
    ambil data dengan use state item, set item
    ambil data yang di dstrk dari axios get url
    filter data booleannya
    gunakan use effect dan panggil fetchnya
    buat validasi apakah ada ? atau lebih dari 0 : no item
    jika ada lakukan maping itemnya, kirim key id, item: item, then on remove

    utk page favoritenya halaman favorite usernya
    gunakan juga usestate item dan set item
    sperti biasa buat fetch item dan bisa lakukan filter item yang hanya true data filter dari set item
    dan juga gunakan useeffect dan panggil fetchnya, juga dependencies []
    buat validasi utk remove, dengan set item, item filter, dari id yang tidak sama id
    buat validasi apakah ada ? atau lebih dari 0 : no item
    jika ada lakukan maping itemnya, kirim key id, item: item, then on remove

    utk tambah
    panggil item set item, dengan usestate null
    dan boolean use state false
    jangan lupa props item id

    buat fetch
    set item dari dari data axios
    dan set item booleannya
    jangan lupa buat use effect dan panggil fetchnya, kirim id didependencies
    buat handel utk update status ? !status
    ambil axios patch url, dan ambil data boolean: status?
    dan set boolean nya : status?
    bisa validasi classnamenya apakah true ? btn : btn

    dibagian home page, pada fetch, simpan items id, dengan maping save id
    jangan lupa use effectnya
    kirim key id dan item id: id jika item length nya lebih besar dari 0 ? ( map, kirim key dan item id: id) : no item

    difav page
    gunakan use state ambil data item id dan set item id
    didalam fetch axios get dari data, set item id dengan filter, boolean? .maping save idnya / simpan id yang true aja

    use efectnya jgn lupa
    kirim key id dan item id: id jika item length nya lebih besar dari 0 ? ( map, kirim key dan item id: id) : no item

## login section

    copy email/password and hardcode to use state /login page
    set item to local storage access_token data.access_token
    pastikan user login tidak harus login lagi ( navigation guard / protection )
    validasi access_token / token from local storage get item access token
    then navigate to home or /
    then return Outlet

    Wrap router: render default ganti dengan index

## styling

gap untuk jarak card,
h- screen or h-1/2 or h- ? untuk bg
grid untuk pengelompokan element + lg:grid cols 1 ? untuk pengelompokan yang lebih spesifik bg-color: untuk warna bg

w-full untuk lebah penuh / 100% dari parent dan akan menyesuaikan content lainnya ex: card
h-full gambar mengisi seluruh tinggi parent dan akan menyesuaikan tinggi tsb
object-cover mengisi container tanpa merubah aspek ratio, gambar zoom in/out selalu menutupi container
hover:elemet/something transisi element efek
shadow-sm or lg or xl untuk shadow element size
border- ? to element border
p-? adalah padding

## form create & update

kirim parameter jika menggunakan form reusable
dan validasi useEffect dan handle

ambil create item dari parameter untuk create page, panggil commponent kirim on submit dengan handle

declare use params
fetch items di update section/page dan gunakan use Effect fetch itemsnya, jangan lupakan dependencies [] dan kirim id dari use params untuk update page tanpa refresh

saat update/edit items, set items dengan, response data name
jangan lupa panggil fetch dan navigate to somewhere
panggil component form dan kirim on submit dengan handle dan update dari parameter ber isi form items
