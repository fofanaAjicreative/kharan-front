import sanitizeHtml from 'sanitize-html' ;

const sanitizeOptions: sanitizeHtml.IOptions = {
    allowedTags: [
        // --- Structure du texte & Blocs ---
        'address', 'article', 'aside', 'footer', 'header', 'h1', 'h2', 'h3', 
        'h4', 'h5', 'h6', 'main', 'nav', 'section', 'div', 'p', 'pre', 
        'blockquote', 'hr', 'br',

        // --- Mise en forme de texte (Inline) ---
        'a', 'abbr', 'b', 'bdi', 'bdo', 'cite', 'code', 'data', 'dfn', 'em', 
        'i', 'kbd', 'mark', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'small', 
        'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr', 'del', 'ins',

        // --- Listes ---
        'ol', 'ul', 'li', 'dl', 'dt', 'dd',

        // --- Tableaux ---
        'table', 'caption', 'colgroup', 'col', 'tbody', 'thead', 'tfoot', 
        'tr', 'td', 'th',

        // --- Médias de base (si besoin) ---
        'img'
      ],
      
      // Essentiel : Vous devez aussi autoriser des attributs de base,
      // sinon vos balises (comme <a href="..."> ou <img src="...">) perdront leurs liens et images.
      allowedAttributes: {
        'a': [ 'href', 'name', 'target', 'rel' ],
        'img': [ 'src', 'alt', 'title', 'width', 'height', 'loading' ],
        '*': [ 'class', 'id' ] // Autorise les classes et IDs sur toutes les balises si nécessaire
      },
      
      // Sécurité supplémentaire : Empêche les attaques XSS via l'attribut javascript: dans les liens
      allowedSchemes: [ 'http', 'https', 'mailto', 'tel' ]
};

/* -------------------------------------------------------------------------------------------- */

    export function  cleanHtml(html: string): string {
        return sanitizeHtml(html,sanitizeOptions);
    }

/* -------------------------------------------------------------------------------------------- */

    export function cleanAndTruncate (html: string, maxLength: number = 500)
    {

        if (!html) return '';

    // 1. On nettoie d'abord l'intégralité du HTML pour des raisons de sécurité
    const cleanHtml = sanitizeHtml(html, sanitizeOptions);

    // 2. Si le texte brut global fait moins que la limite, on renvoie le HTML complet
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cleanHtml;
    const totalLength = tempDiv.textContent?.length || 0;

    if (totalLength <= maxLength) {
        return cleanHtml;
    }

    // 3. Tronquer en conservant l'arbre DOM et les balises fermées
    let currentLength = 0;

    function walkAndTruncate(node: Node): boolean {
        if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        if (currentLength + text.length > maxLength) {
            const remaining = maxLength - currentLength;
            node.textContent = text.substring(0, remaining).trimEnd() + '...';
            currentLength = maxLength;
            return true; // Troncation atteinte
        }
        currentLength += text.length;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
        const children = Array.from(node.childNodes);
        for (const child of children) {
            const isFinished = walkAndTruncate(child);
            if (isFinished) {
            // Supprime tous les nœuds suivants après la troncation
            let next = child.nextSibling;
            while (next) {
                const toRemove = next;
                next = next.nextSibling;
                node.removeChild(toRemove);
            }
            return true;
            }
        }
        }
        return false;
    }

    walkAndTruncate(tempDiv);
    return tempDiv.innerHTML;
    };

/* -------------------------------------------------------------------------------------------- */

    export function stripHtml(html: string): string {

        return sanitizeHtml(html, {
            allowedTags: [],
            allowedAttributes: {}
        })

    }