import ts = require("typescript");

const pkgName = "SU-SEE";

interface DepsFile {
  file: string;
  content: string;
}
interface NamesSet {
  base: string;
  file: string;
  newName: string;
  isEd?: boolean;
}
type NamesSets = NamesSet[];

type DuplicatesNameMap = Map<string, Set<{ file: string }>>;

type BundleHandler = ({ file, content }: DepsFile) => DepsFile;

interface NamesMap {
  base: string;
  file: string;
  short: string;
  oldName: string;
}
type PostProcessExtension =
  | {
      type: "post-process";
      async: true;
      func: (code: string, file?: string) => Promise<string>;
    }
  | {
      type: "post-process";
      async: false;
      func: (code: string, file?: string) => string;
    };
type PreProcessExtension =
  | {
      type: "pre-process";
      async: true;
      func: (code: string, file?: string) => Promise<string>;
    }
  | {
      type: "pre-process";
      async: false;
      func: (code: string, file?: string) => string;
    };
type DependencyExtension =
  | {
      type: "dependency";
      async: true;
      func: (files: DepsFile[]) => Promise<DepsFile[]>;
    }
  | {
      type: "dependency";
      async: false;
      func: (files: DepsFile[]) => DepsFile[];
    };

type ASTExtension =
  | {
      type: "ast";
      async: true;
      func: (sourceFile: ts.SourceFile) => Promise<ts.SourceFile>;
    }
  | {
      type: "ast";
      async: false;
      func: (sourceFile: ts.SourceFile) => ts.SourceFile;
    };
type SuseeExtension =
  | PostProcessExtension
  | PreProcessExtension
  | DependencyExtension
  | ASTExtension;

type OutFiles = {
  commonjs: string | undefined;
  commonjsTypes: string | undefined;
  esm: string | undefined;
  esmTypes: string | undefined;
  main: string | undefined;
  module: string | undefined;
  types: string | undefined;
};
type Target = "commonjs" | "esm" | "both";

type Exports = Record<
  string,
  {
    import?: { default: string; types: string };
    require?: { default: string; types: string };
  }
>;

type NodeJsOutput = {
  target: "nodejs";
  /**
   *  path for package
   *
   * required
   */
  Path: "." | `./${string}`;
  /**
   * Output module type of package , commonjs,esm or both esm and commonjs
   *
   * default - esm
   */
  format?: "commonjs" | "esm" | "both";
};

type WebOutput = { target: "web" };

/**
 * Entry point for SuSee configuration
 */
type EntryPoint = {
  /**
   * Entry of file path of package
   *
   * required
   */
  entry: string;
  /**
   * Info for output
   *
   * required
   */
  output: NodeJsOutput | WebOutput;
  /**
   * Custom tsconfig.json path for package typescript compiler options
   *
   * Priority -
   *  1. this custom tsconfig.json
   *  2. tsconfig.json at root directory
   *  3. default compiler options of susee
   *
   * default - undefined
   */
  tsconfigFilePath?: string | undefined;
  /**
   * When bundling , if there are duplicate declared names , susee will auto rename , if renameDuplicates = false exist with code 1.
   *
   * default - true
   */
  renameDuplicates?: boolean;
};

/**
 * Configuration for Susee Bundler
 */
interface SuSeeConfig {
  /**
   * Array of entry points object
   *
   * required
   */
  entryPoints: EntryPoint[];
  /**
   * Array of susee extension
   *
   * default - []
   */
  extensions?: SuseeExtension[];
  /**
   * Allow bundler to update your package.json.
   *
   * default - true
   */
  allowUpdatePackageJson?: boolean;
}

export type {
  SuseeExtension,
  Target,
  EntryPoint,
  SuSeeConfig,
  DepsFile,
  DuplicatesNameMap,
  NamesMap,
  NamesSet,
  NamesSets,
  BundleHandler,
  Exports,
  OutFiles,
};
