<template lang="pug">
  div
    v-container(grid-list-md text-xs-center)
      
      // Character Name and ME5e Logo
      v-layout(row wrap)
        v-flex(xs4 class="character-name")
          v-text-field(v-model="character.name" label="Character Name")
        
        v-flex(xs4)
          save-load(:character="character" @load="character = $event")

        v-flex(xs4)
          img(title="Mass Effect 5e Logo" src="/images/me5e_logo_450w.png" alt="Mass Effect 5e logo")

      // Top level character info
      v-layout
        // Mods and class info
        v-flex(xs9)
          v-layout(row)
            v-flex
              v-text-field(v-model="character.level" label="Level")
            
            v-flex
              v-select(v-model="character.race" :items="races" label="Race")
            
            v-flex
              v-select(v-model="character.class" :items="$options.class_data" item-text="name" label="Class" return-object)

            v-flex
              v-select(v-model="character.subclass" :items="character.class.subclasses" item-text="name" label="Sub-Class" return-object)

            v-flex
              v-select(v-model="character.background" :items="backgrounds" item-text="name" label="Background" return-object)
          
          v-layout(row)
            v-flex
              v-text-field(v-model="character.max_health" label="Max HP")
            
            v-flex
              v-text-field(v-model="character.ac" label="AC")
            
            v-flex
              v-text-field(v-model="character.initiative" label="Initiative") 

            v-flex
              v-text-field(v-model="character.movement" label="Movement")
            
            v-flex
              v-text-field(v-model="characterProf" label="Proficiency") 

            v-flex
              v-text-field(v-model="character.xp" label="XP")
          
          v-layout(row)
            v-flex
              v-card
                character-power-counter(label="Health" :value="character.health" :max-value="Number(character.max_health)" 
                  @change="character.health = $event" :show-min="false" :show-max="true")
            v-flex
              v-card
                character-power-counter(label="Shields" :value="character.shields" :max-value="5" 
                  @change="character.shields = $event" :show-min="false" :show-max="true")
            v-flex(v-if="hasPowers(bioticPowers) || character.class.id == 'sentinel'")
              v-card
                character-power-counter(label="Barrier Ticks" :value="character.barrier_ticks" :max-value="character.class.progression[character.level-1].barrierTicks || 0" 
                  @change="character.barrier_ticks = $event" :show-min="false" :show-max="true")
        
        // Character Image
        v-flex(xs3)
          div
            img(:title="character.name"
              :src="character.image"
              alt="Character Image"
              style="height: 200px;")
          div
            v-dialog(v-model="image_picker" width="500")
              template(v-slot:activator="{ on }")
                v-btn(color="primary" dark v-on="on") Change Image
              
              v-card
                v-card-title
                  div Change Image URL
                v-card-text
                  v-text-field(v-model="character.image")
      
      // Tab Area
      v-card(style="width: 100%;")
        v-tabs(:grow="true" style="width: 100%; padding: 15px;" slider-color="primary")
          v-tab(key="stats") Skills and Stats
          v-tab(key="weapons") Weapons and Armor
          v-tab(key="character-info") Character Info
          v-tab(key="powers") Powers
          //v-tab(key="equipment") Equipment and Wealth
          //v-tab(key="other") Roleplaying / Other
            
          v-tab-item(key="stats")
            // Skills and Stats
            v-layout(row class="item-area")
              // Skills
              v-flex(xs4 text-xs-center)
                h2 Skills
                //v-card-title
                v-text-field(v-model="skills_table.search" append-icon="mdi-magnify" label="Search" single-line hide-details)
                v-layout(column)
                  v-flex(md6)
                    v-data-table(class="skills-table" :headers="skills_table.headers" :items="character.skills" :search="skills_table.search" :hide-actions="true")
                      template(v-slot:items="props")
                        td(style="width: 10%;")
                          div {{(calcSkillMod(props.item.stat, props.item.prof) >= 0 ? '+' : '') + calcSkillMod(props.item.stat, props.item.prof)}}
                        td(style="width: 70%;") {{props.item.label}}
                        td(style="width: 10%;")
                          v-select(v-model="props.item.prof" :items="[0,.5,1,2]")
                        td(style="width: 10%;") 
                          v-checkbox(v-model="props.item.advantage")
              
              
              // Padding
              v-flex(xs1)
              // Stats
              v-flex(xs7 text-xs-center)
                h2 Stats

                div(class="stats-table-area")
                  div(class="v-table__overflow")
                    table(class="v-datatable v-table theme--light")
                      thead
                        tr
                          th(role="columnheader" class="column text-xs-start")
                          th(role="columnheader" class="column text-xs-left" v-for="stat in stat_names")
                            span(style="text-transform: uppercase;") {{stat}}
                        tr(class="v-datatable__progress")
                          th(colspan="7" class="column")
                      tbody
                        tr(class="raw-value-area")
                          td(style="font-weight: bold;") Ability Scores
                          td(v-for="stat in stat_names")
                            v-text-field(v-model="character.stats[stat]" class="raw-value-field")

                        tr
                          td Ability Modifiers
                          td(v-for="stat in stat_names" class="stat-num")
                            div {{(calcAbilityMod(character.stats[stat]) >= 0 ? '+' : '') + calcAbilityMod(character.stats[stat])}}
                        
                        tr
                          td Saving Throws
                          td(v-for="stat in stat_names" class="stat-num")
                            div {{(calcAbilitySavingThrow(character.stats[stat], character.proficiencies.stats[stat]) >= 0 ? '+' : '') + calcAbilitySavingThrow(character.stats[stat], character.proficiencies.stats[stat])}}

                        tr
                          td Proficiency
                          td(v-for="stat in stat_names")
                            v-checkbox(v-model="character.proficiencies.stats[stat]")
                        
                        
          v-tab-item(key="weapons" style="text-align: left;")
            div(class="item-area")
              h2 Weapons
              v-autocomplete(v-model="character.weapons" label="Equipped Weapons" :items="weapons" item-text="name" return-object multiple)
              weapon-list(:items="character.weapons" v-if="character.weapons.length")

            div(class="item-area")
              h2 Armor
              v-autocomplete(v-model="character.armor" label="Equipped Armor" :items="armor" item-text="name" return-object multiple)
              armor-list(:items="character.armor" v-if="character.armor.length")

          v-tab-item(key="character-info")
            div.item-area.character-info-area

              v-stepper(v-model="selected_character_info_tab" vertical non-linear)
                v-layout(row)
                  v-flex(md2)
                    v-stepper-step(editable step="traits" edit-icon="mdi-checkbox-blank-circle") Traits
                    v-stepper-step(editable step="class-features") Class Features
                    v-stepper-step(editable step="feats") Feats
                    v-stepper-step(editable step="backgrounds") Backgrounds
                    v-stepper-step(editable step="other") Other
                    
                  v-flex(md10 style="min-height: 200px;")
                    v-stepper-content(step="traits" v-if="selected_character_info_tab == 'traits'")
                      h3 Traits
                      br
                      v-autocomplete(v-model="character.traits" label="Selected Traits" :items="racial_traits" item-text="title" return-object multiple)
                      racial-trait.text-xs-left(v-for="trait in character.traits" v-bind:key="trait.id" v-bind:id="trait.id")
                  
                    v-stepper-content(step="class-features" v-if="selected_character_info_tab == 'class-features'")
                        h3 Class Features
                        br
                        v-autocomplete(v-model="character.class_features" label="Selected Class Features" :items="class_features" item-text="name" return-object multiple)
                        class-feature.text-xs-left(v-for="feature in character.class_features" v-bind:id="feature.id") 
                    
                    v-stepper-content(step="feats" v-if="selected_character_info_tab == 'feats'")
                      h3 Feats
                      br
                      v-autocomplete(v-model="character.feats" label="Selected Feats" :items="feats" item-text="name" return-object multiple)
                      v-expansion-panel.my-5
                        v-expansion-panel-content(v-for="feat in character.feats")
                          div(slot="header")
                            v-layout
                              v-flex.xs2.sm1
                                v-avatar(:class="[feat.new ? 'deep-purple' : 'deep-orange']" size="30px")
                                  span(v-if="feat.new").white--text New
                                  span(v-else).white--text PHB
                              v-flex.xs10.sm5.lg2.pt-1
                                strong {{ feat.name }}
                              v-flex.hidden-md-and-down.lg3
                                div(v-if="feat.prerequisite") {{ feat.prerequisite }}
                                div(v-else) -
                              v-flex.hidden-xs-only.sm6.lg6 {{ feat.note }}
                          v-card
                            v-card-text.grey.lighten-3
                              p.display-1.font-weight-thin {{ feat.name }}
                              div(v-if="feat.prerequisite")
                                p #[strong Prerequisite]: #[em {{ feat.prerequisite }}]
                              markdown-file(:id="feat.id" itemType="feats")
                    
                    v-stepper-content(step="backgrounds" v-if="selected_character_info_tab == 'backgrounds'")
                      h3 Backgrounds
                      br
                      v-autocomplete(v-model="character.backgrounds" label="Selected Backgrounds" :items="backgrounds" item-text="name" return-object multiple)
                      v-expansion-panel.mb-2
                        v-expansion-panel-content(v-for="item in character.backgrounds" v-bind:key="item.id").large-panel
                          div(slot="header") {{ item.name }}
                          v-card.grey.lighten-3
                            v-card-text
                              p.display-1.font-weight-thin {{ item.name }}
                              markdown-file(:id="item.id" itemType="backgrounds")

                    v-stepper-content.text-xs-left(step="other" v-if="selected_character_info_tab == 'other'")
                      h3 Other
                      br
                      v-sheet(color="grey")
                        v-expansion-panel
                          v-expansion-panel-content(v-for="(info, ind) in character.other_info")
                            template(v-slot:header)
                              div.title {{info.title}}
                            v-card
                              v-card-text {{info.description}}
                              v-card-actions(style="float: right;")
                                v-btn(icon color="primary"
                                @click="character.other_info.splice(ind, 1)")
                                  v-icon delete

                          v-expansion-panel-content
                            template(v-slot:header)
                                div + Add Info
                            v-card
                              v-card-text
                                v-text-field(v-model="other_info.title" label="Title")
                                v-text-field(v-model="other_info.description" label="Description")
                              v-card-actions(style="float: right;")
                                v-btn(@click="character.other_info.push({title: other_info.title, description: other_info.description})") Save


          v-tab-item(key="powers")
            div(class="item-area")
              
              v-layout(row)
                
                v-flex(md1)

                v-flex(md2 style="float: right;")
                  v-select(label="Power Ability Attribute" v-model="character.power_attribute"
                  :items="[{text: 'Intelligence', value: 'int'},{text: 'Wisdom', value: 'wis'},{text: 'Charisma', value: 'cha'}]")
                  v-select(readonly label="Power Attack Modifier" :items="[power_ability_modifier]" :value="power_ability_modifier")
                
                
                h2(v-if="!character.power_attribute") Please first select an attribute.

                v-flex(v-if="hasPowers(combatPowers) && character.power_attribute")
                  h2 Combat
                  table(class="power-header-table")
                    tbody
                      tr
                        td STR DC
                        td(style="text-align: center;") {{calcSpellDC(character.stats.str)}} 
                      tr
                        td DEX DC
                        td(style="text-align: center;") {{calcSpellDC(character.stats.dex)}}
                      tr
                        td Power Attack Modifier
                        td(style="text-align: center;") {{((calcProfBonus(character.level)+calcAbilityMod(power_attribute)) >= 0 ? '+' : '-')}}{{calcProfBonus(character.level)+calcAbilityMod(power_attribute)}}
                
                v-flex(v-if="hasPowers(techPowers) && character.power_attribute")
                  h2 Tech
                  table(class="power-header-table")
                    tbody
                      tr
                        td
                          span Spell DC 
                          span(style="text-transform: uppercase;") ({{character.power_attribute}})
                        td {{calcSpellDC(power_attribute)}}
                      tr
                        td Tech Point Limit
                        td {{tech_point_limit}}
                  character-power-counter(label="Tech Points" :value="character.tech.tech_points" :max-value="tech_point_max" 
                  @change="character.tech.tech_points = $event")

                v-flex(v-if="hasPowers(bioticPowers) && character.power_attribute")
                  h2 Biotics
                  table(class="power-header-table")
                    tbody
                      tr
                        td 
                          span Spell DC 
                          span(style="text-transform: uppercase;") ({{character.power_attribute}})
                        td {{calcSpellDC(power_attribute)}}
                  div
                    character-power-counter(label="Barrier Uses Remaining" :value="character.barrier_uses"
                    :max-value="character.class.progression[character.level-1].barrierUses || 0" 
                    @change="character.barrier_uses = $event")

                  div(v-for="(slot, ind) in spell_slots")
                    character-power-counter( :value="character.biotics.spell_slots[ind]" :max-value="Number(slot)" v-if="slot"
                    @change="character.biotics.spell_slots[ind] = $event" :label="'Level '+ind+' Spell Slot'" )

                v-flex(v-if="character.class.id == 'sentinel' && character.power_attribute")
                  h2 Sentinel
                   table(class="power-header-table")
                    tbody
                      tr
                        td
                          span Spell DC 
                          span(style="text-transform: uppercase;") ({{character.power_attribute}})
                        td {{calcSpellDC(power_attribute)}}
                      tr
                        td Spell Level
                        td {{spell_level_limit}}
                  div
                    character-power-counter(label="Barrier Uses Remaining" :value="character.barrier_uses"
                    :max-value="character.class.progression[character.level-1].barrierUses || 0" 
                    @change="character.barrier_uses = $event")
                  
                  div
                    character-power-counter(label="Spell Slots" :value="character.tech.tech_points" :max-value="spell_slots" 
                      @change="character.tech.tech_points = $event")

              v-layout(row)
                v-flex(style="text-align: left;")
                  v-autocomplete(v-model="character.powers" label="Powers" :items="powers" item-text="name" return-object multiple)
                  spell-list(:items="character.powers" v-if="character.powers.length")
                  h2(v-if="!character.powers.length") Use the search above to add powers

          //v-tab-item(key="equipment")
          //v-tab-item(key="other")
</template>

<style lang="scss">

  .character-name input {
    font-size: 30px;
  }

  .item-area {
    padding-top: 20px;
  }

  .character-info-area {
    .v-stepper__step__step {
      display: none;
    }
    .v-stepper__wrapper {
      height: inherit !important;
    }
  }

  .tech-button-area {
    .v-btn {
      min-width: 0px;
    }
    .points-text {
      display: inline;
      margin: 15px;
    }
  }
  .power-header-table {
    margin: auto;
    tr {
      text-align: center;
    }
    td {
      border: 1px solid black;
      min-width: 180px;
      min-height: 120px;
      font-size: 18px;
    }
  }

  .raw-value-area {
    input {
      text-align: center;
    }
    .raw-value-field {
      font-size: 12px !important;
      padding: 8px
    }
  }

  .stats-table-area {
    .v-input__control {
      margin: auto;
    }
    .v-input__slot {
        margin-top: 12px;
        margin-bottom: 0px;
    }
    table {
      thead th {
        font-size: 20px !important;
        text-align: center !important;
      }
      td.stat-num {
        font-size: 18px !important;
        text-align: center;
      }
    }
  }
</style>

<script>
import documents from '~/static/data/search/documents.json'
import weapons from '~/static/data/weapons.json'
import armor from '~/static/data/armor_sets.json'
import powers from '~/static/data/spells'
import feats from '~/static/data/feats.json'
import backgrounds from '~/static/data/backgrounds.json'

import SaveLoad from '~/components/character_builder/CharacterSaveLoad.vue'
import CharacterPowerCounter from '~/components/character_builder/CharacterPowerCounter.vue'
import WeaponList from '~/components/weapon/WeaponList.vue'
import SpellList from '~/components/spell/SpellList.vue'
import ArmorList from '~/components/armor_set/ArmorSetList.vue'
import RacialTrait from '~/components/race/RacialTrait.vue'
import ClassFeature from '~/components/class/ClassFeature.vue'

import AdeptData from "~/static/data/classes/adept.json"; 
import EngineerData from "~/static/data/classes/engineer.json"; 
import InfiltratorData from "~/static/data/classes/infiltrator.json"; 
import SentinelData from "~/static/data/classes/sentinel.json"; 
import SoldierData from "~/static/data/classes/soldier.json";
import VanguardData from "~/static/data/classes/vanguard.json";

export default {
  components: {SaveLoad, CharacterPowerCounter, WeaponList, ArmorList, SpellList, RacialTrait, ClassFeature},
  class_data: [AdeptData,EngineerData,InfiltratorData,SentinelData,SoldierData,VanguardData],
  data: () => ({
    image_picker: false,
    selected_character_info_tab: "traits",
    pickWeapon: false,
    removeWeapon: false,
    classData: [AdeptData,EngineerData,InfiltratorData,SentinelData,SoldierData,VanguardData],
    combatPowers: ["soldier","vanguard","infiltrator"],
    techPowers: ["engineer","infiltrator"],
    bioticPowers: ["adept","vanguard"],
    tab: false,
    other_info: {},
    armor: armor || "not found",
    weapons: weapons || "not found",
    documents: documents || "not found",
    powers: powers || "not found",
    feats: feats || "not found",
    backgrounds: backgrounds || "not found",
    stat_names: ['str','dex','con','int','wis','cha'],
    skill_names: ['acrobatics','athletics','deception','electronics','engineering','history','insight','intimidation',
    'investigation','medicine','perception','performance','persuasion','science','slight_of_hand','stealth','survival','vehicle_handling'],
    races: ["Angara","Asari","Batarian","Drell","Elcor","Geth","Hanar","Human",
    "Krogan","Prothean","Quarian","Salarian","Turian","Volus","Vorcha"],
    character: false, // Need this for reactive binding
    skills_table: {
      search: '',
      headers: [
        {text: 'Roll',align: 'start',value: 'roll'},
        {text: 'Skill',value: 'label'},
        {text: 'Prof',value: 'prof'},
        {text: 'Adv',value: 'advantage'}
      ]
    }
  }),

  computed: {
    characterProf: function() {
      return this.calcProfBonus(this.character.level);
    },
    character_docs: function() {
      return this.getDocuments('character');
    },
    racial_traits: function(){
      return this.getDocuments('character','traits');
    },
    class_features: function(){
      return require(`~/static/data/class_features.json`)
      //return this.getDocuments('character','class_features');
    },
    power_attribute: function() {
      return this.character.stats[this.character.power_attribute];
    },
    power_ability_modifier: function() {
      return this.calcProfBonus(this.character.level)+this.calcAbilityMod(this.power_attribute)
    },
    tech_point_max: function() {
      var tpm = 0;
      try {
        tpm = this.character.class.progression[this.character.level - 1].techPoints || 0;
      } finally {
        return tpm;
      }
    },
    tech_point_limit: function() {
      var tpl = 0;
      try {
        tpl = this.character.class.progression[this.character.level - 1].techPointLimit || 0;
      } finally {
        return tpl;
      }
    },
    spell_level_limit: function() {
      var sll = 0;
      try {
        sll = this.character.class.progression[this.character.level - 1].spellLevel || 0;
      } finally {
        return sll;
      }
    },
    spell_slots: function() {
      var slots = {};
      try {
        slots = this.character.class.progression[this.character.level - 1].spellSlots || 0;
      } finally {
        return slots;
      }
    }
  },

  watch: {
    character: {
      immediate: true,
      deep: true,
      handler: function() {
        this.pickWeapon = false;
        this.removeWeapon = false;
        if (this.character) {
          this.$store.commit('characterBuilder/save', this.character);
        }
      }
    }
  },

  created() {
    this.character = this.$store.state.characterBuilder.character;
  },

  methods: {
    hasPowers: function(power_arr) {
      var c_id = this.character.class.id;
      var arr = power_arr;
      for(var ind in arr) {
        if (arr[ind] == c_id) {
          return true;
        }
      }
    },
    getDocuments: function(type, subType) {
      var docs = this.documents.filter(function(doc) {
        return doc.type == type;
      });
      if (subType) {
        docs = docs.filter(function(doc) {
          return doc.subType == subType;
        });
      }
      return docs;
    },
    calcAbilityMod: function(ability_score) {
      return Math.floor((ability_score - 10) / 2)
    },
    calcAbilitySavingThrow: function(ability_score, isProf) {
      var num = this.calcAbilityMod(ability_score);
      if (isProf) {
       num += this.calcProfBonus(this.character.level)
      }
      //if (ability_score == 16) console.log("Calculating Saving Throw", num);
      return num;

    },
    calcProfBonus: function(level) {
      return Math.ceil(level/4) + 1;
    },
    calcSkillMod: function(ability_str, prof_score) {
      var baseMod = this.calcAbilityMod(this.character.stats[ability_str]);
      if (prof_score > 0) {
        baseMod += Math.floor(prof_score * this.calcProfBonus(this.character.level));
      }
      return baseMod;
    },
    calcSpellDC: function(ability_score) {
      return 8+this.calcProfBonus(this.character.level)+this.calcAbilityMod(ability_score);
    }
  }

  
};
</script>