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
        public ?Paginator $paginator = null, // Laravel paginator instance

        // Ja nav padots paginator, tad manuāli izveidot pages count
        public $itemsPerPage = null,
        public $itemsCount = null,
        public $currentPage = null,

        // Cik pages rādīt ap currentPage
        public $onEachSide = 3,

        // Link template #page# tas ir page number, kas tiks replaced
        public $link = '',
    )
    {
        if ($paginator) {
            $this->hasPages = $paginator->hasPages();
            $this->onFirstPage = $paginator->onFirstPage();
            $this->hasMorePages = $paginator->hasMorePages();
            $this->currentPage = $paginator->currentPage();
            $this->itemPerPage = $paginator->perPage();
            $this->itemsCount = $paginator->total();

            $this->previousPageUrl = $paginator->previousPageUrl();
            $this->nextPageUrl = $paginator->nextPageUrl();

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
            $this->hasMorePages = $pagesCount > $this->currentPage;

            $this->previousPageUrl = $this->pageLinkFromTemplate($this->currentPage - 1);;
            $this->nextPageUrl = $this->pageLinkFromTemplate($this->currentPage + 1);
        }



        $pages = [];
        $minPage = null;
        $maxPage = null;
        for ($c = max(1, $this->currentPage - $this->onEachSide); $c < min($this->currentPage + $this->onEachSide + 1, $this->pagesCount); $c++) {
            if (is_null($minPage)) {
                $minPage = $c;
            }
            $maxPage = $c;

            $pages[$c] = $this->paginator ? $$this->paginator->link($c) : $this->pageLinkFromTemplate($c);
        }

        if ($minPage > 2) {
            $this->elements[] = '...';
        }

        $this->elements[] = $pages;

        if ($maxPage < $pagesCount - 2) {
            $this->elements[] = '...';
        }
    }

    public function render(): View|Closure|string
    {
        return view('ui::components.pagination');
    }

    private function pageLinkFromTemplate($pageNumber) {
        $link = $this->link;
        $link = str_replace('#page#', $pageNumber, $link);
        $link = str_replace('%23page%23', $pageNumber, $link);

        return $link;
    }

    private function clampPage($pageNumber) {
        if ($pageNumber < 1) {
            return 1;
        }
        if ($pageNumber > $this->pagesCount) {
            return $this->pagesCount;
        }
        return $pageNumber;
    }
}
