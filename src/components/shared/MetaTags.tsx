import { useEffect } from 'react';

interface MetaTagsProps {
    title: string;
    description?: string;
}

const MetaTags = ({ title, description }: MetaTagsProps) => {
    useEffect(() => {
        // Set document title
        const fullTitle = `${title} | Good Things Co. Boutique`;
        document.title = fullTitle;

        // Set meta description
        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', description);
        }

        // Set OpenGraph title (For Social Media previews)
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            document.head.appendChild(ogTitle);
        }
        ogTitle.setAttribute('content', fullTitle);

    }, [title, description]);

    return null;
};

export default MetaTags;
