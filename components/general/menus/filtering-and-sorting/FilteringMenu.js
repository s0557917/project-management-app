import { Menu, ScrollArea, TextInput, createStyles } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Tag, ArrowRight, Square } from "phosphor-react";
import { useState } from "react";
import CategoryFilter from "../../../task-list/ListBlock/CategoryFilter";
import Filter from "./Filter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateCategory,
  addNewCategory,
} from "../../../../utils/db/queryFunctions/categories";
import getThemeColor from "../../../../utils/color/getThemeColor";
import { useQuery } from "@tanstack/react-query";
import {
  getFilters,
  updateFilters,
} from "../../../../utils/db/queryFunctions/settings";
import { getAllCategories } from "../../../../utils/db/queryFunctions/categories";
import ColorButton from "./ColorButton";

export default function FilteringMenu() {
  const { data: categories, isFetching: isFetchingCategories } = useQuery(
    ["categories"],
    getAllCategories
  );
  const { data: filters, isFetching: isFetchingFilters } = useQuery(
    ["filters"],
    getFilters
  );

  const queryClient = useQueryClient();

  const [isFilteringMenuOpened, setIsFilteringMenuOpened] = useState(false);
  const [isColorMenuOpened, setIsColorMenuOpened] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [selectedNewColor, setSelectedNewColor] = useState("");

  const colors = [
    "#de1b1b",
    "#de6c1b",
    "#ded41b",
    "#80de1b",
    "#0f8717",
    "#0ffcfc",
    "#0fb1fc",
    "#0f1ffc",
    "#791bde",
    "#c71bde",
    "#de1b76",
    "#000000",
  ];

  const modifiedFiltersMutation = useMutation(
    (updatedFilters) => updateFilters(updatedFilters),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries("filters");
      },
    }
  );

  const categoryStatusMutation = useMutation(
    (updatedCategory) => updateCategory(updatedCategory),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries("categories");
      },
    }
  );

  const newCategoryMutation = useMutation(
    (newCategory) => addNewCategory(newCategory),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries("categories");
      },
    }
  );

  async function onCategoryStatusChanged(category, status) {
    const modifiedCategory = { ...category, active: status };
    categoryStatusMutation.mutate(modifiedCategory);
  }

  function onCategoryAdded(categoryTitle) {
    if (selectedNewColor == "" || categoryTitle == "") {
      showNotification({
        autoClose: 3000,
        type: "error",
        color: "red",
        title: "Error creating your category",
        message:
          "Please ensure that you select a color and a title for your category!",
      });
    } else {
      newCategoryMutation.mutate({
        name: categoryTitle,
        color: selectedNewColor,
      });
      setSelectedNewColor("#d4d4d4");
      setNewCategoryTitle("");
    }
  }

  async function onFilterStatusChanged(filterName, status) {
    const index = filters.findIndex((setting) => setting.name === filterName);
    const modifiedSettings = [...filters];
    modifiedSettings[index].value = status;
    modifiedFiltersMutation.mutate(modifiedSettings);
  }

  const useStyles = createStyles((theme) => ({
    dropdown: {
      marginRight: 50,
    },
    label: {
      color: theme.black,
    },
  }));
  const classes = useStyles();

  return (
    <Menu
      opened={isFilteringMenuOpened}
      shadow="md"
      width={300}
      classNames={{ dropdown: classes.dropdown, label: classes.label }}
      onClose={() => {
        setIsFilteringMenuOpened(false);
        setSelectedNewColor("#d4d4d4");
        setNewCategoryTitle("");
      }}
    >
      <Menu.Target>
        <button
          className="hover:scale-110 active:scale-90 transition-all"
          onClick={() => setIsFilteringMenuOpened(true)}
        >
          <Tag size={28} color="#16a34a" />
        </button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Categories</Menu.Label>
        <ScrollArea style={{ height: 100 }} offsetScrollbars>
          <ul>
            {categories &&
              categories.length > 0 &&
              categories
                ?.sort((a, b) => a.name.localeCompare(b.name))
                ?.map((category) => (
                  <CategoryFilter
                    key={category.id}
                    category={category}
                    circleSize={16}
                    onCategoryStatusChanged={onCategoryStatusChanged}
                    textSize={"text-xs"}
                    completed={category?.active}
                  />
                ))}
            {filters &&
              filters.length > 0 &&
              filters
                ?.sort((a, b) => a.name.localeCompare(b.name))
                ?.map((displaySetting) => {
                  return (
                    <Filter
                      key={displaySetting.id}
                      filterName={displaySetting.name}
                      textSize={"text-xs"}
                      onFilterStatusChanged={onFilterStatusChanged}
                      active={displaySetting.value}
                    />
                  );
                })}
          </ul>
        </ScrollArea>
        <Menu.Divider></Menu.Divider>

        <p
          className={`text-xs ${getThemeColor("text-gray-900", "text-white")}`}
        >
          Create a new category
        </p>
        <div className="flex items-end px-2">
          <Menu
            opened={isColorMenuOpened}
            onClose={() => setIsColorMenuOpened(false)}
          >
            <Menu.Target>
              <button
                onClick={() => setIsColorMenuOpened(true)}
                className="hover:scale-105 active:scale-95 transition-all"
              >
                <Square
                  size={40}
                  color={selectedNewColor || "#d4d4d4"}
                  weight="fill"
                />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <div className="grid grid-cols-3">
                {colors.map((color) => (
                  <ColorButton
                    color={color}
                    setSelectedNewColor={setSelectedNewColor}
                    setColorMenuOpened={setIsColorMenuOpened}
                  />
                ))}
              </div>
            </Menu.Dropdown>
          </Menu>
          <TextInput
            value={newCategoryTitle}
            onChange={(event) => setNewCategoryTitle(event.currentTarget.value)}
            // label="Create a new category"
            placeholder="Category Name"
            rightSection={
              <button
                className="bg-green-600 transition-all hover:bg-green-700 p-1 rounded-full text-white"
                onClick={() => {
                  onCategoryAdded(newCategoryTitle);
                  setIsFilteringMenuOpened(false);
                }}
              >
                <ArrowRight size={18} color="#ffffff" weight="bold" />
              </button>
            }
          />
        </div>
      </Menu.Dropdown>
    </Menu>
  );
}
