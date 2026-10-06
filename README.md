# DSP Translation Converter

Use it to convert downloaded language files from [Crowdin](https://crowdin.com/project/dyson-sphere-program).
(Rise of the Dark Fog update only)

[Translation Converter](https://dspcd.github.io/translation-converter/)

## Usage

1. Download `DysonSphereProgram_The_Dark_Fog.json` for your language from [Crowdin](https://crowdin.com/project/dyson-sphere-program).
2. Select (or drop) that file in the converter: it is only checked at this point, and any errors are listed. Pick the language and press **Download** to save the zip; changing the language rebuilds it with that language's header and folder.
3. Unzip the result in `\steamapps\common\Dyson Sphere Program`.

## Validation of translations

- **Errors** (the zip is not generated): a `{0}` variable is missing or unexpected, or a rich-text tag such as `<color=...>` is opened without being closed (or the reverse).
- **Warnings** (the zip is generated): a string has different tags than the source, usually a dropped `<color>` highlight. This also covers item icon codes such as `\\tieb-;` (a dropped code, or a single backslash where the source has two).

## Downloads

The **Downloads** tab of the site lists ready-made translations, with file name, language, size, date and download count.

## Description
Further instructions in the channel how-to-install in our [Discord](https://discord.gg/HrAF896H9A)

## Author

[RogerHN](https://github.com/rogerhnn)

## Contributors

[seigneurao](https://github.com/seigneurao)

## License

This project is dual-licensed under CC BY-NC-SA 4.0 and DSPTC NCL License - see the LICENSE.md file for details
