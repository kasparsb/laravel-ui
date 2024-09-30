<?php

namespace Kasparsb\Ui\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

use Illuminate\Pagination\Paginator;

class Pagination extends Component
{
    public $hasPages = false;
    public $onFirstPage = false;
    public $hasMorePages = false;

    public $pagesCount = null;

    public $previousPageUrl = '';
    public $nextPageUrl = '';

    public $elements = [];

    public function __construct(
        public $paginator = null, // Laravel paginator instance

        // Ja nav padots paginator, tad manuāli izveidot pages count
        public $itemsPerPage = null,
        public $itemsCount = null,
        public $currentPage = null,

        // Cik pages rādīt ap currentPage
        public $onEachSide = 3,
        // Cik lapas rādīt no sākuma un beigām
        public $onEdges = 2,

        // Link template #page# tas ir page number, kas tiks replaced
        public $link = '',

        public $hideNav = false,
        public $hideNavPrev = false,
        public $hideNavNext = false,

        // Vaic current lapai uzlikt savādāku izskatu nekā citām lapā
        public $pageVariant = 'ghost',
        public $currentPageVariant = 'outline',
        public $dotsVariant = 'ghost',
        public $navVariant = 'ghost',
        public $navPrevVariant = '',
        public $navNextVariant = '',
    )
    {

        if ($this->hideNav) {
            $this->hideNavPrev = true;
            $this->hideNavNext = true;
        }

        if (!$this->navPrevVariant) {
            $this->navPrevVariant = $this->navVariant;
        }
        if (!$this->navNextVariant) {
            $this->navNextVariant = $this->navVariant;
        }

        /**
         * Sākuma vērtības atkarībā no tā vai ir pieejams paginator vai nav
         */
        if ($this->paginator) {
            $this->hasPages = $this->paginator->hasPages();
            $this->onFirstPage = $this->paginator->onFirstPage();
            $this->hasMorePages = $this->paginator->hasMorePages();
            $this->currentPage = $this->paginator->currentPage();
            $this->itemsPerPage = $this->paginator->perPage();
            $this->itemsCount = $this->paginator->total();

            $this->previousPageUrl = $this->paginator->previousPageUrl();
            $this->nextPageUrl = $this->paginator->nextPageUrl();

            $this->pagesCount = ceil($this->itemsCount / $this->itemsPerPage);
        }
        else {
            $this->pagesCount = ceil($this->itemsCount / $this->itemsPerPage);

            $this->currentPage = intval($this->currentPage);
            if (!$this->currentPage) {
                $this->currentPage = 1;
            }

            $this->hasPages = $this->itemsCount > $this->itemsPerPage;
            $this->onFirstPage = $this->currentPage === 1;
            $this->hasMorePages = $this->pagesCount > $this->currentPage;

            $this->previousPageUrl = $this->pageLink($this->currentPage - 1);
            $this->nextPageUrl = $this->pageLink($this->currentPage + 1);
        }

        /**
         * Saliekam redzamās lapas
         */
        $pages = $this->collectPages();
        $this->elements = $this->dividePagesInGroups($pages);
    }

    /**
     * Savācam visas lapas, kuras ir jārāda pagination
     */
    private function collectPages() {
        $pages = [];
        // Sākuma lapas
        for ($pageNumber = 1; $pageNumber <= $this->onEdges; $pageNumber++) {
            $pages[$pageNumber] = $this->pageLink($pageNumber);
        }

        // Lapas ap current page
        for (
            $pageNumber = max(1, $this->currentPage - $this->onEachSide); // lai neierauj mīnusā
            $pageNumber <= min($this->currentPage + $this->onEachSide, $this->pagesCount); // lai nepārkāpj pāri pageCount
            $pageNumber++
        ) {
            $pages[$pageNumber] = $this->pageLink($pageNumber);
        }

        // Beigu lapas
        for ($pageNumber = $this->pagesCount - $this->onEdges + 1; $pageNumber <= $this->pagesCount; $pageNumber++) {
            $pages[$pageNumber] = $this->pageLink($pageNumber);
        }

        return $pages;
    }

    /**
     * Sagalam visas lapas, kuras nav secīgas pa grupām un
     * grupas atdalām ar delimiter
     *
     *
     * Saliekm atdalītājus starp lapām, kuras nav secīgas
     * 1 2 3 4 5   10 11 12
     *          ...
     * 1 2   5 6 7   10 11 12
     *    ...     ...
     */
    private function dividePagesInGroups($pages) {
        $groups = [];

        $prevPageNumber = null;
        $portion = [];
        foreach ($pages as $pageNumber => $link) {
            // Starpā ir vairāk kā viena lapa
            if ($prevPageNumber && $pageNumber - $prevPageNumber > 2) {
                $groups[] = $portion;
                $groups[] = '...';
                $portion = [];
            }
            // starpā ir viena lapa, tāpēc liekam to lapu nevis delimiter
            else if ($prevPageNumber && $pageNumber - $prevPageNumber > 1) {
                $portion[$pageNumber - 1] = $this->pageLink($pageNumber - 1);
                $groups[] = $portion;
                $portion = [];
            }

            $portion[$pageNumber] = $link;

            $prevPageNumber = $pageNumber;
        }
        if ($portion) {
            $groups[] = $portion;
        }

        return $groups;
    }

    private function pageLink($pageNumber) {
        if ($this->paginator) {
            return $this->paginator->url($pageNumber);
        }
        else {
            $r = str_replace('#page#', $pageNumber, $this->link);
            return str_replace('%23page%23', $pageNumber, $r);
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.pagination');
    }
}
