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


                <x-ui::tabs tab="invoices">
                    <x-ui::tab value="invoices">Invoices</x-ui::tab>
                    <x-ui::tab value="orders">Orders</x-ui::tab>
                </x-ui::tabs>

                <x-ui::title class="t-4">Tabs without selected tab</x-ui::title>

                <x-ui::tabs tab="orders">
                    <x-ui::tab value="">Invoices</x-ui::tab>
                    <x-ui::tab value="orders">Orders</x-ui::tab>
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

                <x-ui::table>
                    <thead>
                        <tr>
                            <th>
                                <x-ui::checkbox name="asdasd" />
                            </th>
                            <th>Number</th>
                            <th>Total</th>
                            <th>VAT</th>
                            <th>E-mail</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <x-ui::checkbox name="asdasd" />
                            </td>
                            <td>SA-123123</td>
                            <td>34.56Eur</td>
                            <td>4.5Eur</td>
                            <td>kaspars@webit.lv</td>
                        </tr>
                    </tbody>
                </x-ui::table>

                <x-ui::table width="full">
                    <x-slot:head>
                        <th>
                            <x-ui::checkbox name="asdasd" />
                        </th>
                        <th>Number</th>
                        <th>Total</th>
                        <th>VAT</th>
                        <th>E-mail</th>
                    </x-slot>
                    <x-slot:body>
                        <tr>
                            <td>
                                <x-ui::checkbox name="asdasd" />
                            </td>
                            <td>SA-123123</td>
                            <td>34.56Eur</td>
                            <td>4.5Eur</td>
                            <td><x-ui::toggle-switch name="prop1" :checked="true" /></td>
                        </tr>
                        <tr>
                            <td>
                                <x-ui::checkbox name="asdasd" />
                            </td>
                            <td>SA-133</td>
                            <td>4.56Eur</td>
                            <td>2.5Eur</td>
                            <td><x-ui::toggle-switch name="prop1" :checked="true" /></td>
                        </tr>
                    </x-slot>
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