namespace SuSee {
  const pkgName = "SU-SEE";

  export interface DepsFile {
    file: string;
    content: string;
  }
  export interface NamesSet {
    base: string;
    file: string;
    newName: string;
    isEd?: boolean;
  }
  export type NamesSets = NamesSet[];

  export type DuplicatesNameMap = Map<string, Set<{ file: string }>>;

  export type BundleHandler = ({ file, content }: DepsFile) => DepsFile;

  export interface NamesMap {
    base: string;
    file: string;
    short: string;
    oldName: string;
  }
  export type PostProcessHook =
    | {
        async: true;
        func: (code: string, file?: string) => Promise<string>;
      }
    | {
        async: false;
        func: (code: string, file?: string) => string;
      };
  export type OutPutHookFunc = (...args: any[]) => PostProcessHook;

  export type OutFiles = {
    commonjs: string | undefined;
    commonjsTypes: string | undefined;
    esm: string | undefined;
    esmTypes: string | undefined;
    main: string | undefined;
    module: string | undefined;
    types: string | undefined;
  };
  export type Target = "commonjs" | "esm" | "both";

  export type Exports = Record<
    string,
    {
      import?: { default: string; types: string };
      require?: { default: string; types: string };
    }
  >;

  /**
   * Build configuration.
   */
  export interface BuildOptions {
    /**
     * Entry file to bundle.
     */
    entry: string;
    /**
     * Output target: `"commonjs"`, `"esm"`, or `"both"`.
     *
     * default - "both"
     */
    target?: Target;
    /**
     * Default export name if applicable.
     * - Required when the entry has default export and `options.target` = `"commonjs"` or `"both"`
     *
     * Example :
     *
     * ```ts
     * const foo = {bar:"foo"};
     * export default foo; // defaultExportName = "foo"
     * ```
     *
     * default - undefined
     */
    defaultExportName?: string | undefined;
    /**
     * Whether this build represents the main export , otherwise subpath export.
     *
     * default - true
     */
    isMainExport?: boolean;
    /**
     * Output directory.
     *
     * For a subpath export (not the main export), `outDir` must be a single-level
     * nested folder under the main output directory.
     *
     * Example:
     *
     * ```ts
     * const mainOutdir = "dist";
     * const subpathOutdir = "dist/subpath"; // subpath export in package.json will be "./subpath"
     * const fooOutdir = "dist/foo"; // subpath export in package.json will be "./foo"
     * ```
     *
     * default - "dist"
     */
    outDir?: string;
    /**
     * Identifiers to replace with blanks during compilation.
     *
     * default - []
     */
    replaceWithBlank?: string[];
    /**
     * Array of hook functions executed during compilation.
     *
     * default - []
     */
    hooks?: PostProcessHook[];
  }
}

export default SuSee;
