<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>UI</title>
    <x-ui::style />
</head>
<body>

    <x-ui::layout>
        <x-slot:menu>
            <x-ui::nav-menu class="my-4" item="invoices">
                <x-ui::nav-menu-item name="invoices">
                    <x-tabler-file-invoice />
                    <span>Invoices</span>
                </x-ui:nav-menu-item>
                <x-ui::nav-menu-item name="partners">
                    <x-tabler-users-group />
                    Partners
                </x-ui:nav-menu-item>
            </x-ui::nav-menu>
        </x-slot>
        <x-slot:menu-basement class="py-4">
            <x-ui::nav-menu>
                <x-ui::nav-menu-item name="settings">
                    <x-tabler-settings />
                    Settings
                </x-ui:nav-menu-item>
                <x-ui::nav-menu-item name="logout">
                    <x-tabler-logout />
                    Logout
                </x-ui::nav-menu-item>
            </x-ui::nav-menu>
        </x-slot>



            <x-ui::page class="regular">

                <x-ui::header>
                    <x-slot:title>
                        Calendar settings text size default
                    </x-slot>
                    <x-slot:description>
                        Manage calendar availability
                    </x-slot>
                    <x-slot:aside>
                        <x-ui::button>Save</x-ui::button>
                    </x-slot>
                </x-ui::header>

                <x-ui::header>
                    <x-slot:title class="t-4">
                        Calendar settings text size 4
                    </x-slot>
                    <x-slot:description>
                        Manage calendar availability
                    </x-slot>
                    <x-slot:aside>
                        <x-ui::button>Save</x-ui::button>
                    </x-slot>
                </x-ui::header>

                <x-ui::title>Title default text size 6</x-ui::title>
                <x-ui::title class="t-3.5">Title text size 3.5</x-ui::title>
                <x-ui::title class="t-4">Title text size 4</x-ui::title>
                <x-ui::title class="t-5">Title text size 5</x-ui::title>
                <x-ui::title class="t-6">Title text size 6</x-ui::title>

                <x-ui::title class="t-6 fw-b">Title text size 6 BOLD</x-ui::title>


                <x-ui::form-vertical>
                    <x-ui::toggle-switch name="prop1" :checked="true" />
                    <x-ui::toggle-switch label="Enable all functions" labelPosition="right" />
                    <x-ui::toggle-switch-card title="Marketing emails" description="Receive emails about your account security." />
                    <x-ui::checkbox label="Check phone" name="asd" />
                    <x-ui::checkbox label="All enabled" name="asdasd" :checked="true" />
                </x-ui::form-vertical>



                <x-ui::nav-menu class="vertical">
                    <x-ui::nav-menu-item><x-tabler-alert-circle /> Invoices</x-ui:nav-menu-item>
                    <x-ui::nav-menu-item :selected="true"><x-tabler-alert-circle />Partners</x-ui:nav-menu-item>
                </x-ui::nav-menu>

                <x-ui::card>
                    <x-slot:title>Only header slots default text size</x-slot>
                    <x-slot:title-description>Header slots title, title-description, header-aside</x-slot>
                    <x-slot:header-aside>Enter your details for</x-slot>
                </x-ui::card>

                <x-ui::card>
                    <x-slot:title class="t-4 fw-b">Only header slots custom text size 4 BOLD</x-slot>
                    <x-slot:title-description>Header slots title, title-description, header-aside</x-slot>
                    <x-slot:header-aside>Enter your details for</x-slot>
                </x-ui::card>

                <x-ui::card>
                    <x-slot:header>
                        <x-ui::title class="t-5">Details custom text size 5</x-ui::title>
                        <x-ui::title-description>Enter your details for</x-ui::title-description>
                    </x-slot>
                </x-ui::card>

                <x-ui::card>
                    <x-slot:header>
                        <x-ui::header>
                            <x-slot:title>
                                Real header component in card header
                            </x-slot>
                            <x-slot:description>
                                Header component
                            </x-slot>
                            <x-slot:aside>
                                <x-ui::button>Save</x-ui::button>
                            </x-slot>
                        </x-ui::header>
                    </x-slot>
                </x-ui::card>


                <x-ui::tabs item="invoices">
                    <x-ui::tab name="invoices">Invoices</x-ui::tab>
                    <x-ui::tab name="orders">Orders</x-ui::tab>
                </x-ui::tabs>

                <x-ui::title class="t-4">Tabs without selected tab</x-ui::title>

                <x-ui::tabs item="orders">
                    <x-ui::tab name="">Invoices</x-ui::tab>
                    <x-ui::tab name="orders">Orders</x-ui::tab>
                </x-ui::tabs>


                <x-ui::card>
                    <x-slot:header>
                        <x-ui::title>Details text size default</x-ui::title>
                        <x-ui::title-description>Enter your details for</x-ui::title-description>
                    </x-slot>

                    <x-slot:footer>
                        <x-ui::row-items>
                            <x-ui::button name="cancel" variant="secondary">Cancel</x-ui::button>
                            <x-ui::button name="save" variant="primary">Save</x-ui::button>
                        </x-ui::row-items>
                    </x-slot>



                    <x-ui::form-vertical>

                        <x-ui::field-date label="From" name="from" value="" description="Enter from date" />
                        <x-ui::field-date label="From min date" name="from2" value="" description="Enter from date" min-date="2024-03-08" />
                        <x-ui::field-date label="From min max date" name="from2" value="" description="Enter from date" min-date="2024-03-08" max-date="2024-03-20" />
                        <x-ui::field-text label="Surname" name="surname" value="" description="Enter your surname" />

                        <x-ui::field type="email" placeholder="Email" label="Email" name="email" value="" description="What is your email address" />

                        <x-ui::field-textarea placeholder="Enter comments" label="Comments" name="comments" value="" description="What is your comments about situation" />


                        @php
                            $options = [
                                'a' => 'A',
                                'b' => 'B',
                                'c' => 'C',
                                'd' => 'D',
                            ];
                        @endphp
                        <x-ui::field-select
                            label="Invoice type"
                            description="What invoice type to filter"
                            name="aaasdasd"
                            value="C"
                            empty="Select type"
                            :options="$options" />

                        @php
                            $options = [
                                'individual' => 'Individual',
                                'legal' => 'Legal',
                            ];
                        @endphp
                        <x-ui::field-select
                            label="Client"
                            description="Client legal type"
                            name="aaasdasdasd"
                            :empty="true"
                            :options="$options" />


                        <x-ui::checkbox label="All enabled" name="asdasd" :checked="true" />

                        <x-ui::toggle-switch label="Enable all functions" labelPosition="right" />

                        <x-ui::toggle-switch-card title="Marketing emails" description="Receive emails about your account security." />
                    </x-ui::form-vertical>
                </x-ui::card>

                <x-ui::card>
                    <x-slot:title class="t-3">First title</x-slot>
                    <x-slot:title-description>First title description lorem ipsum</x-slot>
                    <x-slot:header-aside>
                        <x-ui::button>Save</x-ui::button>
                    </x-slot:aside>

                    Card body

                </x-ui::card>

                <x-ui::empty-state>
                    <x-slot:title>No working hours set.</x-slot>
                    <x-slot:title-description>Add your working hours here</x-slot>
                    <x-slot:button>
                        <x-ui::button-primary>Add working hours</x-ui::button-primary>
                    </x-slot>
                </x-ui::empty-state>



                <x-ui::dropdown-menu name="menu1" side="bottom" align="right">
                    <x-ui::menu-item link-source="data-editlink">Viens</x-ui::menu-item>
                    <x-ui::menu-item link-source="data-removelink">Divi</x-ui::menu-item>
                </x-ui::dropdown-menu>

                <x-ui::title>First table</x-ui::title>
                @php
                    $table1Rows = [
                        [
                            'number' => 'number 1',
                            'total' => '2024-01-01',
                            'email' => '1',
                        ],
                        [
                            'number' => 'number 2',
                            'total' => '2024-02-01',
                            'email' => '0',
                        ],
                        [
                            'number' => 'number 3',
                            'total' => '2024-03-21',
                            'email' => '0',
                        ],
                        [
                            'number' => 'number 4',
                            'total' => '2024-04-20',
                            'email' => '1',
                        ],
                        [
                            'number' => 'number 5',
                            'total' => '2024-05-12',
                            'email' => '1',
                        ],
                    ];
                @endphp
                <x-ui::table
                    :rows="$table1Rows"
                    class="w-full"
                    >
                    <x-ui::table-col name="number" class="w-36">
                        <x-tabler-edit />Total
                    </x-ui::table-col>
                    <x-ui::table-col
                        type="field-date"
                        name="total"
                        >
                        Total
                    </x-ui::table-col>
                    <x-ui::table-col
                        type="toggle-switch"
                        name="email"
                        class="w-28"
                        >Email</x-ui::table-col>
                </x-ui::table>


                <x-ui::title>Second table</x-ui::title>
                @php
                    $table2Rows = [
                        [
                            'sdf' => 'sdf 1',
                            'asdwe' => 'asdwe 1',
                            'don' => 'don 1',
                        ],
                        [
                            'sdf' => 'sdf 2',
                            'asdwe' => 'asdwe 2',
                            'don' => 'don 2',
                        ],
                        [
                            'sdf' => 'sdf 3',
                            'asdwe' => 'asdwe 3',
                            'don' => 'don 3',
                        ],
                    ];
                @endphp
                <x-ui::table :rows="$table2Rows" class="w-full" :formatter="\App\InvoicesTable::class">
                    <x-ui::table-col class="w-52" name="sdf">Alha</x-ui::table-col>
                    <x-ui::table-col class="w-52" name="asdwe">beta</x-ui::table-col>
                    <x-ui::table-col name="don">domina</x-ui::table-col>
                </x-ui::table>


                <x-ui::calendar size="8" maxDate="2024-03-20" />

                <x-ui::calendar-period size="8" name_from="from" name_till="till" maxDate="2024-03-20" />

                <x-ui::title>Calendar ar default date state</x-ui::title>
                <x-ui::calendar size="8" :default_date_state="['disabled' => true]" :state="['2024-03-12' => ['disabled' => false]]" />

                <x-ui::title>Calendar ar stateUrl</x-ui::title>
                <x-ui::calendar size="8" :state-url="route('calendar.status')" />

                <x-ui::title>Calendar ar custom css class un krasam</x-ui::title>
                <x-ui::calendar size="8" class="calendar-with-colors" />
                <style>
                    .calendar-with-colors {
                        --text-color-date-default: var(--color-400);
                        --text-color-date-secondary: var(--color-400);
                        --border-radius-date: 0;
                    }
                </style>

                <x-ui::calendar class="bordered" size="36" name_from="from" name_till="till"  />

                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />


            </x-ui::page>

    </x-ui::layout>






    <x-ui::svgs />
    <x-ui::script />
</body>
</html>