import fontawesome from '@fortawesome/fontawesome';
import faChevronCircleRight from '@fortawesome/fontawesome-free-solid/faChevronCircleRight';
import faSquare from '@fortawesome/fontawesome-free-solid/faSquare';
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash';

const loader = (() => {
  fontawesome.library.add(faChevronCircleRight);
  fontawesome.library.add(faSquare);
  fontawesome.library.add(faTrash);
})();

export default loader;
