const puppeteer = require('puppeteer');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function scrapeToPDF(url, outputFolder) {
    const browser = await puppeteer.launch();
    
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    const urlPath = new URL(url).pathname;

		// Ubah nama agar bisa disimpan dan sesuai slug link
    const fileName = urlPath.substring(urlPath.lastIndexOf('/') + 1).replace('.html', '') + '.pdf';

    // Simpan ke dalam outputFolder dengan format pdf
    await page.pdf({ path: `${outputFolder}/${fileName}`, format: 'A4' });

    await page.close();

    await browser.close();
}

async function mergePdfs(folderPath) {
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.pdf'));
    const mergedPdf = await PDFDocument.create();
  
    for (let file of files) {
        const filePath = `${folderPath}/${file}`;
        console.log(`Merging: ${filePath}`);
        const pdf = await PDFDocument.load(fs.readFileSync(filePath));
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
    }
  
    const mergedPdfFile = await mergedPdf.save();
    fs.writeFileSync(`${folderPath}/merged.pdf`, mergedPdfFile);
    console.log('Merged PDF created at:', `${folderPath}/merged.pdf`);
  }
  
// Letakkan semua URL yang sudah discrape pada langkah 1.1
const urls = [
    "https://doc.rust-lang.org/stable/book/title-page.html",
    "https://doc.rust-lang.org/stable/book/foreword.html",
    "https://doc.rust-lang.org/stable/book/ch00-00-introduction.html",
    "https://doc.rust-lang.org/stable/book/ch01-00-getting-started.html",
    "https://doc.rust-lang.org/stable/book/ch01-01-installation.html",
    "https://doc.rust-lang.org/stable/book/ch01-02-hello-world.html",
    "https://doc.rust-lang.org/stable/book/ch01-03-hello-cargo.html",
    "https://doc.rust-lang.org/stable/book/ch02-00-guessing-game-tutorial.html",
    "https://doc.rust-lang.org/stable/book/ch03-00-common-programming-concepts.html",
    "https://doc.rust-lang.org/stable/book/ch03-01-variables-and-mutability.html",
    "https://doc.rust-lang.org/stable/book/ch03-02-data-types.html",
    "https://doc.rust-lang.org/stable/book/ch03-03-how-functions-work.html",
    "https://doc.rust-lang.org/stable/book/ch03-04-comments.html",
    "https://doc.rust-lang.org/stable/book/ch03-05-control-flow.html",
    "https://doc.rust-lang.org/stable/book/ch04-00-understanding-ownership.html",
    "https://doc.rust-lang.org/stable/book/ch04-01-what-is-ownership.html",
    "https://doc.rust-lang.org/stable/book/ch04-02-references-and-borrowing.html",
    "https://doc.rust-lang.org/stable/book/ch04-03-slices.html",
    "https://doc.rust-lang.org/stable/book/ch05-00-structs.html",
    "https://doc.rust-lang.org/stable/book/ch05-01-defining-structs.html",
    "https://doc.rust-lang.org/stable/book/ch05-02-example-structs.html",
    "https://doc.rust-lang.org/stable/book/ch05-03-method-syntax.html",
    "https://doc.rust-lang.org/stable/book/ch06-00-enums.html",
    "https://doc.rust-lang.org/stable/book/ch06-01-defining-an-enum.html",
    "https://doc.rust-lang.org/stable/book/ch06-02-match.html",
    "https://doc.rust-lang.org/stable/book/ch06-03-if-let.html",
    "https://doc.rust-lang.org/stable/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html",
    "https://doc.rust-lang.org/stable/book/ch07-01-packages-and-crates.html",
    "https://doc.rust-lang.org/stable/book/ch07-02-defining-modules-to-control-scope-and-privacy.html",
    "https://doc.rust-lang.org/stable/book/ch07-03-paths-for-referring-to-an-item-in-the-module-tree.html",
    "https://doc.rust-lang.org/stable/book/ch07-04-bringing-paths-into-scope-with-the-use-keyword.html",
    "https://doc.rust-lang.org/stable/book/ch07-05-separating-modules-into-different-files.html",
    "https://doc.rust-lang.org/stable/book/ch08-00-common-collections.html",
    "https://doc.rust-lang.org/stable/book/ch08-01-vectors.html",
    "https://doc.rust-lang.org/stable/book/ch08-02-strings.html",
    "https://doc.rust-lang.org/stable/book/ch08-03-hash-maps.html",
    "https://doc.rust-lang.org/stable/book/ch09-00-error-handling.html",
    "https://doc.rust-lang.org/stable/book/ch09-01-unrecoverable-errors-with-panic.html",
    "https://doc.rust-lang.org/stable/book/ch09-02-recoverable-errors-with-result.html",
    "https://doc.rust-lang.org/stable/book/ch09-03-to-panic-or-not-to-panic.html",
    "https://doc.rust-lang.org/stable/book/ch10-00-generics.html",
    "https://doc.rust-lang.org/stable/book/ch10-01-syntax.html",
    "https://doc.rust-lang.org/stable/book/ch10-02-traits.html",
    "https://doc.rust-lang.org/stable/book/ch10-03-lifetime-syntax.html",
    "https://doc.rust-lang.org/stable/book/ch11-00-testing.html",
    "https://doc.rust-lang.org/stable/book/ch11-01-writing-tests.html",
    "https://doc.rust-lang.org/stable/book/ch11-02-running-tests.html",
    "https://doc.rust-lang.org/stable/book/ch11-03-test-organization.html",
    "https://doc.rust-lang.org/stable/book/ch12-00-an-io-project.html",
    "https://doc.rust-lang.org/stable/book/ch12-01-accepting-command-line-arguments.html",
    "https://doc.rust-lang.org/stable/book/ch12-02-reading-a-file.html",
    "https://doc.rust-lang.org/stable/book/ch12-03-improving-error-handling-and-modularity.html",
    "https://doc.rust-lang.org/stable/book/ch12-04-testing-the-librarys-functionality.html",
    "https://doc.rust-lang.org/stable/book/ch12-05-working-with-environment-variables.html",
    "https://doc.rust-lang.org/stable/book/ch12-06-writing-to-stderr-instead-of-stdout.html",
    "https://doc.rust-lang.org/stable/book/ch13-00-functional-features.html",
    "https://doc.rust-lang.org/stable/book/ch13-01-closures.html",
    "https://doc.rust-lang.org/stable/book/ch13-02-iterators.html",
    "https://doc.rust-lang.org/stable/book/ch13-03-improving-our-io-project.html",
    "https://doc.rust-lang.org/stable/book/ch13-04-performance.html",
    "https://doc.rust-lang.org/stable/book/ch14-00-more-about-cargo.html",
    "https://doc.rust-lang.org/stable/book/ch14-01-release-profiles.html",
    "https://doc.rust-lang.org/stable/book/ch14-02-publishing-to-crates-io.html",
    "https://doc.rust-lang.org/stable/book/ch14-03-cargo-workspaces.html",
    "https://doc.rust-lang.org/stable/book/ch14-04-installing-binaries.html",
    "https://doc.rust-lang.org/stable/book/ch14-05-extending-cargo.html",
    "https://doc.rust-lang.org/stable/book/ch15-00-smart-pointers.html",
    "https://doc.rust-lang.org/stable/book/ch15-01-box.html",
    "https://doc.rust-lang.org/stable/book/ch15-02-deref.html",
    "https://doc.rust-lang.org/stable/book/ch15-03-drop.html",
    "https://doc.rust-lang.org/stable/book/ch15-04-rc.html",
    "https://doc.rust-lang.org/stable/book/ch15-05-interior-mutability.html",
    "https://doc.rust-lang.org/stable/book/ch15-06-reference-cycles.html",
    "https://doc.rust-lang.org/stable/book/ch16-00-concurrency.html",
    "https://doc.rust-lang.org/stable/book/ch16-01-threads.html",
    "https://doc.rust-lang.org/stable/book/ch16-02-message-passing.html",
    "https://doc.rust-lang.org/stable/book/ch16-03-shared-state.html",
    "https://doc.rust-lang.org/stable/book/ch16-04-extensible-concurrency-sync-and-send.html",
    "https://doc.rust-lang.org/stable/book/ch17-00-oop.html",
    "https://doc.rust-lang.org/stable/book/ch17-01-what-is-oo.html",
    "https://doc.rust-lang.org/stable/book/ch17-02-trait-objects.html",
    "https://doc.rust-lang.org/stable/book/ch17-03-oo-design-patterns.html",
    "https://doc.rust-lang.org/stable/book/ch18-00-patterns.html",
    "https://doc.rust-lang.org/stable/book/ch18-01-all-the-places-for-patterns.html",
    "https://doc.rust-lang.org/stable/book/ch18-02-refutability.html",
    "https://doc.rust-lang.org/stable/book/ch18-03-pattern-syntax.html",
    "https://doc.rust-lang.org/stable/book/ch19-00-advanced-features.html",
    "https://doc.rust-lang.org/stable/book/ch19-01-unsafe-rust.html",
    "https://doc.rust-lang.org/stable/book/ch19-03-advanced-traits.html",
    "https://doc.rust-lang.org/stable/book/ch19-04-advanced-types.html",
    "https://doc.rust-lang.org/stable/book/ch19-05-advanced-functions-and-closures.html",
    "https://doc.rust-lang.org/stable/book/ch19-06-macros.html",
    "https://doc.rust-lang.org/stable/book/ch20-00-final-project-a-web-server.html",
    "https://doc.rust-lang.org/stable/book/ch20-01-single-threaded.html",
    "https://doc.rust-lang.org/stable/book/ch20-02-multithreaded.html",
    "https://doc.rust-lang.org/stable/book/ch20-03-graceful-shutdown-and-cleanup.html",
    "https://doc.rust-lang.org/stable/book/appendix-00.html",
    "https://doc.rust-lang.org/stable/book/appendix-01-keywords.html",
    "https://doc.rust-lang.org/stable/book/appendix-02-operators.html",
    "https://doc.rust-lang.org/stable/book/appendix-03-derivable-traits.html",
    "https://doc.rust-lang.org/stable/book/appendix-04-useful-development-tools.html",
    "https://doc.rust-lang.org/stable/book/appendix-05-editions.html",
    "https://doc.rust-lang.org/stable/book/appendix-06-translation.html",
    "https://doc.rust-lang.org/stable/book/appendix-07-nightly-rust.html"
  ]
  
  const start = async () => {
    // Nama folder untuk menyimpan file pdf hasil scrape
    const outputFolder = 'output';
    
    // Iterate through each URL and call scrapeToPDF function
    for (const url of urls) {
      await scrapeToPDF(url, outputFolder);
      console.log(`Scraping ${url} to PDF Done`);
    }
  
    // Atur folder tempat seluruh pdf disimpan
    mergePdfs('output').catch(err => console.error(err));
  
  }
  
  start()
  