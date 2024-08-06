
Leandro@DESKTOP-M0PK5BA MINGW64 ~/Desktop/Practicas/IceCream-Back (LECWorkBranch)
$ npm audit
# npm audit report

lodash.pick  >=4.0.0
Severity: high
Prototype Pollution in lodash - https://github.com/advisories/GHSA-p6mc-m468-83gw
fix available via `npm audit fix`
node_modules/lodash.pick
  cheerio  0.19.0 - 1.0.0-rc.3
  Depends on vulnerable versions of css-select
  Depends on vulnerable versions of lodash.pick
  node_modules/cheerio
    inline-css  2.2.4 - 4.0.0
    Depends on vulnerable versions of cheerio
    Depends on vulnerable versions of extract-css
    node_modules/inline-css
      @nestjs-modules/mailer  1.3.18 - 1.7.1
      Depends on vulnerable versions of inline-css
      node_modules/@nestjs-modules/mailer
    list-stylesheets  1.1.1 - 1.2.10
    Depends on vulnerable versions of cheerio
    node_modules/list-stylesheets
      extract-css  1.0.5 - 2.0.1
      Depends on vulnerable versions of list-stylesheets
      Depends on vulnerable versions of style-data
      node_modules/extract-css
    style-data  1.1.3 - 1.4.8
    Depends on vulnerable versions of cheerio
    node_modules/style-data

nth-check  <2.0.1
Severity: high
Inefficient Regular Expression Complexity in nth-check - https://github.com/advisories/GHSA-rp65-9cf3-cjxr
fix available via `npm audit fix`
node_modules/nth-check
  css-select  <=3.1.0
  Depends on vulnerable versions of nth-check
  node_modules/css-select

9 high severity vulnerabilities

To address all issues, run:
  npm audit fix
