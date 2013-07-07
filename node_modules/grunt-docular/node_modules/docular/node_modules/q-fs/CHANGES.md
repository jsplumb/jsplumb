
# 0.1.29

-   Fixes `makeTree` on the latest Mac OS X.

# 0.1.27

-   Fixed the build

# 0.1.26

-   Fix lingering QQ dependency.
-   list and stat no longer return lazy Array or Stat objects, but
    rather normal promises.

# 0.1.25

-   Added support for graceful back-off on the file descriptor pool

# 0.1.21

-   Synchronized Q and Q-IO.  Q-IO needed a similar fix to below for
    Node 0.7 compatibility, depending on SYS.

# 0.1.20

-   Updated for Node 0.6, removed SYS dependency (@domenicdenicola #2)

# 0.1.19

-   Synchronized Q, QQ, Q-IO.

# 0.1.18

-   Added readLink.

# 0.1.17

-   Fixed issue #1 (@hornairs), FS.write returns a deferred
    instead of a promise for the completion of the writing.
-   Synchronized dependency on q-io, again.

# 0.1.16

-   Synchronized dependencies.

# 0.1.15

-   Fixed a bug with "binary" encoding producing strings
    instead of buffers.

# 0.1.14

-   Synchronized dependencies.

# 0.1.13

-   Updated ``fs-boot`` dependency to fix ``directory``.

# 0.1.12

-   Added a test (and fixed) partial/range read support.

# 0.1.11

-   Switched to Markdown
-   Added range read support.
-   Altered open/read/write/append to accept an options
    record instead of flags and charset.
-   Fixed test termination conditions.

# 0.1.10

-   Dependency revisions.
-   Moved lib dir up one level.

# 0.1.8

-   Fixed a race condition in `makeTree`; not waiting for
    parent directory to be created.
-   Improved error messages.

# 0.1.4

-   Added `makeDirectory`.
-   Added `relative` function, which stats the source
   directory to determine whether to compute relative to a
   directory or another kind of file.
-   Added `symbolicLink` (which creates a symbolic link with
   the given text) and `symbolicCopy` (which behaves like
   `copyTree` except using a symbolic link as the mechanism
   and automatically generates the link text using
   `relative`.
-   Wrapped `Stats` objects so they can be emulated in
   browsers and be guaranteed to have the same API on both
   sides.
-   Changed the convention for storing modules in global
   scope when executed as <scripts>
-   Fixed a problem with silent errors in `listTree`
   filter functions.
-   Fixed the `makeTree` algorithm for relative directories.
-   Moved the fs-boot API basics to lib/common so they can be
   shared implicitly with other API's that use lib/common.

# 0.1.3

-   Added the option for the listTree filter guard to return
    a promise.

# 0.1.2

-   Added the option to stop traversing subtrees with the
    filter guard of listTree by returning "null" instead of
    boolean.

# 0.1.1

-   Added lazy directory listings and stats.  You can call
    Array and Stats methods on these promises and recieve
    promises for the eventual resultion.

# 0.1.0: BACKWARD INCOMPATIBLE*

-   *`relative` is no longer available.  Use
    `relativeFromFile` for the same behavior.  The change
    distinguishes the named behavior from
    `relativeFromDirectory`.  `relative` may be reintroduced
    in a future version, but it will perform a `stat` on the
    path first and branch to either of the explicit forms,
    bearing in mind that performance penalty.
-   *NPM no longer supports packaged submodules.  Access
    `Mock` and `Root` from `"q-fs"` instead of the `Fs`
    exports of `"q-fs/*"`.
-   Added `remove`, `statLink`, `statFd`, `link`, `chown`,
    `chmod`, `append`, `listDirectoryTree`, `makeTree`,
    `removeTree`.
-   Added `toObject(path_opt, charset_opt)` for reading a
    file system into an in-memory object.
-   Added `mock(fs, path)`, and `merge(fss)` for reading
    file systems into a read-only mock, and for merging file
    system layer objects into a single file system, like a
    tar copy.

# 0.0.16

-   Fixed a minor bug in distinguishing directories from
    other files in mocked file systems.
-   Generalized the mock.reroot method so that it can be
    used on any file system object.
-   Fixed a bug in contains that applied when the source
    directory was the root directory.
-   Improved handling of the root directory in mock
    file-systems.

# 0.0.15

-   Added "q-fs/root" for creating an attenuated file system
    API object for a subdirectory of another file system API
    object
-   Added relativeFromDirectory and relativeFromFile to
    distinguish the two cases explicitly.  relative is depre

# 0.0.14

-   Moved "q-fs/common" from "q-fs/common-fs".
-   Added "q-fs/mock" for mock file systems, particularly
    for making mock file systems from zip file extracts.

# 0.0.9

-   fixed a bug in the listTree due to a Q module mismatch.

# 0.0.8

-   reved up Q to version 0.2 so duck-promises would work.

# 0.0.7

-   minor bugfix in the common refactor

# 0.0.6

-   factored out common, engine agnostic components in
    anticipation of using them in a mock filesystem.
-   added "b" buffered mode to file open.

# 0.0.5

-   Added
    -   listTree
    -   contains
    -   relative
    -   canonical
    -   absolute
    -   isDirectory

# 0.0.4

-   Added list(path)

# 0.0.3

-   synced dependencies

# 0.0.2

-   fixed some dependency lists
 
# 0.0.1

-   replaced util with n-util in response to Node module
    name conflict
-   restructured for overlay style package compatibility

