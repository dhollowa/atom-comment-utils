# comment-utils
An Atom package that supports quick reflowing and reformatting of C++ style comments.
Invoking *ctrl-shift-/* repeatedly on a selection cycles between the following comment styles:

<pre>
/** The quick brown fox jumped over the lazy dog. The quick brown fox jumped
 *  over the lazy dog. The quick brown fox jumped over the lazy dog. The quick
 *  brown fox jumped over the lazy dog.
 */
</pre>
and
<pre>
// The quick brown fox jumped over the lazy dog. The quick brown fox jumped
// over the lazy dog. The quick brown fox jumped over the lazy dog. The
// quick brown fox jumped over the lazy dog.
</pre>

Doxygen style prefixes of the form *@c token* are not broken at end-of-line boundaries.

The comments are automatically reflowed to fit preferred line length and are indentation preserving.

Single line comments are formatted like this:

<pre>
/** The quick brown fox jumped over the lazy dog. */
</pre>

or

<pre>
// The quick brown fox jumped over the lazy dog.
</pre>
