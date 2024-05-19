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
    )
    {
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


        /**
         * Saliekm atdalītājus starp lapām, kuras nav secīgas
         * 1 2 3 4 5   10 11 12
         *          ...
         * 1 2   5 6 7   10 11 12
         *    ...     ...
         */
        $prevPageNumber = null;
        $portion = [];
        foreach ($pages as $pageNumber => $link) {
            // Starpā ir vairāk kā viena lapa
            if ($prevPageNumber && $pageNumber - $prevPageNumber > 2) {
                $this->elements[] = $portion;
                $this->elements[] = '...';
                $portion = [];
            }
            // starpā ir viena lapa, tāpēc liekam to lapu nevis delimiter
            else if ($prevPageNumber && $pageNumber - $prevPageNumber > 1) {
                $portion[$pageNumber - 1] = $this->pageLink($pageNumber - 1);
                $this->elements[] = $portion;
                $portion = [];
            }

            $portion[$pageNumber] = $link;

            $prevPageNumber = $pageNumber;
        }
        if ($portion) {
            $this->elements[] = $portion;
        }
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
