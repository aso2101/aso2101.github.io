<xsl:stylesheet 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    xmlns:xi="http://www.w3.org/2001/XInclude"
    xmlns:tei="http://www.tei-c.org/ns/1.0" 
    xmlns:fn="http://www.w3.org/2005/xpath-functions" 
    version="1.0" 
    exclude-result-prefixes="tei xi fn">
  <xsl:output method="html" indent="no" encoding="UTF-8" version="4.0"/>
  <xsl:strip-space elements="tei:*"/>
  
  <!-- C !-->
  <!-- caesura !-->
  <xsl:template match="tei:caesura">
    <xsl:element name="span">
      <xsl:attribute name="class">caesura</xsl:attribute>
    </xsl:element>
  </xsl:template>
  <!-- choice !-->
  <xsl:template match="tei:choice[@type='chaya']">
    <xsl:element name="span">
      <xsl:attribute name="class">prakritword san</xsl:attribute>
      <xsl:apply-templates select="tei:orig"/>
    </xsl:element>
    <xsl:element name="span">
      <xsl:attribute name="class">sanskritword san</xsl:attribute>
      <xsl:apply-templates select="tei:reg"/>
    </xsl:element>
  </xsl:template>

  <!-- D !-->
  <!-- div !-->
  <xsl:template match="tei:text[@xml:id='MāMā']//tei:div[@type='aṅka']">
    <xsl:element name="div">
      <xsl:attribute name="class">panel panel-default chapter</xsl:attribute>
      <xsl:element name="div">
	<xsl:attribute name="class">panel-heading clearfix</xsl:attribute>
	<xsl:element name="div">
	  <xsl:attribute name="class">panel-title pull-left</xsl:attribute>
	  <xsl:apply-templates select="tei:head" mode="bypass"/>
	</xsl:element>
      </xsl:element>
      <xsl:element name="div">
	<xsl:attribute name="class">panel-collapse collapse in</xsl:attribute>
	<xsl:attribute name="id">
	  <xsl:value-of select="translate(translate(./@xml:id,'ā','a'),'.','-')"/>
	</xsl:attribute>
	<xsl:element name="div">
	  <xsl:attribute name="class">panel-body</xsl:attribute>
	  <xsl:apply-templates/>
	  <xsl:element name="p">
	    <xsl:attribute name="class">fleuron text-center</xsl:attribute>
	    <xsl:text>K</xsl:text>
	  </xsl:element>
	</xsl:element>
      </xsl:element>
    </xsl:element>
  </xsl:template>

  <!-- F !-->
  <!-- foreign !-->
  <xsl:template match="tei:foreign[@xml:lang='san-Latn']">
    <xsl:element name="span">
      <xsl:attribute name="class">foreign</xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- H !-->
  <!-- head !-->
  <xsl:template match="tei:head"/>
  <xsl:template match="tei:head" mode="bypass">
    <xsl:element name="a">
      <xsl:attribute name="class">san</xsl:attribute>
      <xsl:attribute name="data-toggle">collapse</xsl:attribute>
      <xsl:attribute name="href">
	<xsl:text>#</xsl:text>
	<xsl:value-of select="translate(translate(./parent::tei:div/@xml:id,'ā','a'),'.','-')"/>
      </xsl:attribute>
      <xsl:attribute name="aria-expanded">true</xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  
  <!-- L !-->
  <!-- l !-->
  <xsl:template match="tei:l">
    <xsl:element name="span">
      <xsl:attribute name="class">l san</xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- lb !-->
  <xsl:template match="tei:lb">
    <xsl:element name="br"/>
  </xsl:template>

  <!-- lg !-->
  <xsl:template match="tei:text[@xml:id='MāMā']//tei:lg[not(ancestor::tei:sp)]">
    <xsl:element name="div">
      <xsl:attribute name="class">row</xsl:attribute>
      <xsl:element name="div">
	<xsl:attribute name="class">col-sm-2</xsl:attribute>
      </xsl:element>
      <xsl:element name="div">
	<xsl:attribute name="class">col-sm-10</xsl:attribute>
	<xsl:call-template name="button-group">
	  <xsl:with-param name="id" select="@xml:id"/>
	  <xsl:with-param name="met" select="@met"/>
	</xsl:call-template>
	<xsl:element name="div">
	  <xsl:attribute name="class">lg clearfix</xsl:attribute>
	  <xsl:attribute name="id">
	    <xsl:value-of select="@xml:id"/>
	  </xsl:attribute>
	  <xsl:apply-templates/>
	</xsl:element>
      </xsl:element>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:text[@xml:id='MāMā']//tei:sp//tei:lg">
    <xsl:element name="div">
      <xsl:attribute name="class">lg clearfix</xsl:attribute>
      <xsl:attribute name="id">
	<xsl:value-of select="@xml:id"/>
      </xsl:attribute>
      <xsl:call-template name="button-group">
	<xsl:with-param name="id" select="@xml:id"/>
	<xsl:with-param name="met" select="@met"/>
      </xsl:call-template>
      <xsl:apply-templates/>
    </xsl:element>    
  </xsl:template>
  <xsl:template match="tei:text[@xml:id='RaMa']//tei:lg"/>
  <xsl:template match="tei:text[@xml:id='RaMa']//tei:lg" mode="bypass">
    <xsl:element name="div">
      <xsl:attribute name="class">row</xsl:attribute>
      <xsl:element name="div">
	<xsl:attribute name="class">col-sm-12</xsl:attribute>
	<xsl:element name="div">
	  <xsl:attribute name="class">lg</xsl:attribute>
	  <xsl:apply-templates/>
	</xsl:element>
      </xsl:element>
    </xsl:element>
  </xsl:template>

  <!-- N !-->
  <!-- name !-->
  <xsl:template match="tei:name">
    <xsl:element name="span">
      <xsl:attribute name="class">name san</xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- note !-->
  <xsl:template match="tei:note[@type='reference']">
    <xsl:element name="span">
      <xsl:attribute name="class">san ref</xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- P !-->
  <!-- p !-->
  <xsl:template match="tei:text[@xml:id='MāMā']//tei:p[not(ancestor::tei:sp)]">
    <xsl:element name="p">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:text[@xml:id='MāMā']//tei:sp//tei:p">
    <xsl:element name="p">
      <xsl:attribute name="class">sp clearfix</xsl:attribute>
      <xsl:call-template name="button-group">
	<xsl:with-param name="id" select="@xml:id"/>
      </xsl:call-template>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="tei:text[@xml:id='RaMa']//tei:p"/>
  <xsl:template match="tei:text[@xml:id='RaMa']//tei:p" mode="bypass">
    <xsl:element name="p">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- Q !-->
  <!-- quote !-->
  <xsl:template match="tei:quote">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>quote </xsl:text>
	<xsl:text>san </xsl:text>
	<xsl:value-of select="@rend"/>
      </xsl:attribute>
      <xsl:apply-templates mode="bypass"/>
    </xsl:element>
  </xsl:template>

  <!-- R !-->
  <xsl:template match="tei:ref">
    <xsl:element name="span">
      <xsl:attribute name="class">ref san</xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  
  <!-- S !-->
  <!-- s !-->
  <xsl:template match="tei:s">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>s san</xsl:text>
	<xsl:if test=".//tei:choice[@type='chaya']"> prakrit</xsl:if>
      </xsl:attribute>
      <xsl:attribute name="id">
	<xsl:value-of select="@xml:id"/>
      </xsl:attribute>
      <xsl:if test=".//tei:choice[@type='chaya']">
	<span class="chaya-toggle">e</span>
      </xsl:if>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- sp !-->
  <xsl:template match="tei:sp">
    <xsl:element name="div">
      <xsl:attribute name="class">row sp</xsl:attribute>
      <xsl:element name="div">
	<xsl:attribute name="class">col-sm-2</xsl:attribute>
        <xsl:apply-templates mode="bypass" select="tei:speaker"/>
      </xsl:element>
      <xsl:element name="div">
	<xsl:attribute name="class">col-sm-10</xsl:attribute>
	<xsl:apply-templates/>
      </xsl:element>
    </xsl:element>
  </xsl:template>

  <!-- speaker !-->
  <xsl:template match="tei:speaker"/>
  <xsl:template match="tei:speaker" mode="bypass">
    <xsl:element name="span">
      <xsl:attribute name="class">speaker san</xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- stage !-->
  <!-- case one: it is not contained within a character’s
       lines !-->
  <xsl:template match="tei:stage[not(ancestor::tei:sp)]">
    <xsl:element name="div">
      <xsl:attribute name="class">row</xsl:attribute>
      <xsl:element name="div">
	<xsl:attribute name="class">col-sm-2</xsl:attribute>
      </xsl:element>
      <xsl:element name="div">
	<xsl:attribute name="class">col-sm-10 clearfix</xsl:attribute>
	<xsl:call-template name="button-group">
	  <xsl:with-param name="id" select="@xml:id"/>
	</xsl:call-template>
	<xsl:element name="p">
	  <xsl:attribute name="class">
	    <xsl:text>stage san text-center</xsl:text>
	  </xsl:attribute>
	  <xsl:apply-templates/>
	</xsl:element>
      </xsl:element>
    </xsl:element>
  </xsl:template>
  <!-- case two: it is contained within a characters’ lines !-->
  <xsl:template match="tei:sp//tei:stage">
    <xsl:element name="span">
      <xsl:attribute name="class">
	<xsl:text>stage san stage-sp</xsl:text>
      </xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- T !-->
  <!-- TEI !-->
  <xsl:template match="tei:TEI">
    <xsl:element name="div">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- text !-->
  <xsl:template match="tei:text">
    <!-- attach this to the "root" division !-->
    <xsl:element name="div">
      <xsl:attribute name="class">row</xsl:attribute>
      <xsl:element name="div">
	<xsl:attribute name="class">col-sm-12</xsl:attribute>
	<xsl:element name="div">
	  <xsl:attribute name="class">panel-group</xsl:attribute>
	  <xsl:apply-templates/>
	</xsl:element>
      </xsl:element>
      <xsl:element name="div">
	<xsl:attribute name="id">modals</xsl:attribute>
	<xsl:call-template name="build-modals"/>
      </xsl:element>
    </xsl:element>
  </xsl:template>

  <!-- title !-->
  <xsl:template match="tei:title">
    <xsl:element name="span">
      <xsl:attribute name="class">title san</xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- W !-->
  <xsl:template match="tei:w">
    <xsl:element name="span">
      <xsl:attribute name="class">word</xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <!-- BUTTON-GROUP !-->
  <!-- button group to the right of each verse or paragraph !-->
  <xsl:template name="button-group">
    <xsl:param name="id"/><!-- the ID of the verse or paragraph !-->
    <xsl:param name="met"/><!-- the meter, if identified !-->
    <xsl:element name="div">
      <xsl:attribute name="class">pull-right</xsl:attribute>
      <xsl:element name="div">
	<xsl:attribute name="class">btn-group</xsl:attribute>
	<xsl:if test="$met != ''">
	  <xsl:variable name="target">
	    <xsl:text>#modal-</xsl:text>
	    <xsl:value-of select="$met"/>
	  </xsl:variable>
	  <xsl:element name="a">
	    <xsl:attribute name="href">
	      <xsl:value-of select="$target"/>
	    </xsl:attribute>
	    <xsl:attribute name="data-toggle">modal</xsl:attribute>
	    <xsl:attribute name="class">btn btn-default btn-sm modal-toggle</xsl:attribute>
	    <xsl:attribute name="data-target">
	      <xsl:value-of select="$target"/>
	    </xsl:attribute>
	    <xsl:text>M</xsl:text>
	  </xsl:element>
	</xsl:if>
	<xsl:if test="//tei:text[@xml:id='RaMa']//*[@corresp=$id]">
	  <xsl:variable name="target">
	    <xsl:text>#modal-</xsl:text>
	    <xsl:value-of select="translate(translate($id,'ā','a'),'.','-')"/>
	    <xsl:text>-rasamanjari</xsl:text>
	  </xsl:variable>
	  <xsl:element name="a">
	    <xsl:attribute name="href">
	      <xsl:value-of select="$target"/>
	    </xsl:attribute>
	    <xsl:attribute name="data-toggle">modal</xsl:attribute>
	    <xsl:attribute name="class">btn btn-default btn-sm modal-toggle</xsl:attribute>
	    <xsl:attribute name="data-target">
	      <xsl:value-of select="$target"/>
	    </xsl:attribute>
	    <xsl:text>R</xsl:text>
	  </xsl:element>
	</xsl:if>
	<!-- if ... !-->
      </xsl:element>
    </xsl:element>
  </xsl:template>

  <!-- BUILD-MODALS !-->
  <xsl:template name="build-modals">
    <!-- i assume for these purposes that every modal
	 will have its own separate division in the document.
	 the rasamañjarī will be divided into divisions
	 that each have a @corresp attribute. !-->
    <xsl:for-each select="//tei:text[@xml:id='RaMa']//tei:div[@corresp]">
      <xsl:variable name="reference">
	<xsl:value-of select="translate(translate(@corresp,'ā','a'),'.','-')"/>
      </xsl:variable>
      <xsl:variable name="number-citation">
	<xsl:value-of select="substring-after(@corresp,'.')"/>
      </xsl:variable>
      <xsl:variable name="this-modal-name">
	<xsl:text>modal-</xsl:text>
	<xsl:value-of select="$reference"/>
	<xsl:text>-rasamanjari</xsl:text>
      </xsl:variable>
      <xsl:element name="div">
	<xsl:attribute name="id">
	  <xsl:value-of select="$this-modal-name"/>
	</xsl:attribute>
	<xsl:attribute name="class">modal fade text-left</xsl:attribute>
	<xsl:attribute name="tabindex">-1</xsl:attribute>
	<xsl:attribute name="role">dialog</xsl:attribute>
	<xsl:attribute name="aria-labelledby">
	  <xsl:text>modal-</xsl:text>
	  <xsl:value-of select="$reference"/>
	  <xsl:text>-label</xsl:text>
	</xsl:attribute>
	<xsl:element name="div">
	  <xsl:attribute name="class">modal-dialog modal-lg</xsl:attribute>
	  <xsl:attribute name="role">document</xsl:attribute>
	  <!-- MODAL CONTENT !-->
	  <xsl:element name="div">
	    <xsl:attribute name="class">modal-content</xsl:attribute>
	    <!-- MODAL HEADER !-->
	    <xsl:element name="div">
	      <xsl:attribute name="class">modal-header</xsl:attribute>
	      <button type="button" class="close modal-close"  aria-label="Close"><span aria-hidden="true"><xsl:text>×</xsl:text></span></button>
	      <h3 id="modal-{$reference}-label"><em>Rasamañjarī</em><xsl:text> on </xsl:text><em>Mālatīmādhava</em><xsl:text> </xsl:text><xsl:value-of select="$number-citation"/></h3>
	    </xsl:element>
	    <!-- MODAL BODY !-->
	    <xsl:element name="div">
	      <xsl:attribute name="class">modal-body</xsl:attribute>
	      <!-- the verse or paragraph or stage direction
		   to which this modal is attached. !-->
	      <xsl:element name="div">
		<xsl:attribute name="class">modal-quote san <xsl:value-of select="local-name()"/></xsl:attribute>
		<xsl:apply-templates select="*[not(self::tei:note)]"/>
	      </xsl:element>
	      <!-- THE CONTENT OF EACH TAB !-->
	      <xsl:apply-templates select="." mode="bypass"/>
	    </xsl:element>
	    <!-- MODAL FOOTER !-->
	    <xsl:element name="div">
	      <xsl:attribute name="class">modal-footer</xsl:attribute>
	      <button type="button" class="btn btn-primary modal-close">Close</button>
	    </xsl:element>
	  </xsl:element>
	</xsl:element>
      </xsl:element>
    </xsl:for-each>
  </xsl:template>

  <!-- REFERENCE !-->
  <xsl:template name="reference">
    <xsl:param name="n1"/>
    <xsl:param name="n2"/>
    <xsl:param name="n3"/>
    <xsl:param name="style"/>
    <xsl:variable name="separator">
      <xsl:choose>
	<xsl:when test="$style = 'dashes'">
	  <xsl:text>-</xsl:text>
	</xsl:when>
	<xsl:otherwise>
	  <xsl:text>.</xsl:text>
	</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="workTitle">
      <xsl:choose>
	<xsl:when test="$style = 'dashes'">
	  <xsl:call-template name="work-abbrev">
	    <xsl:with-param name="encoding" select="'ASCII'"/>
	  </xsl:call-template>
	</xsl:when>
	<xsl:otherwise>
	  <xsl:call-template name="work-abbrev">
	    <xsl:with-param name="encoding" select="'UTF8'"/>
	  </xsl:call-template>
	</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <!-- construct the reference starting backwards !-->
    <xsl:value-of select="$workTitle"/>
    <xsl:if test="$n1 != ''">
      <xsl:value-of select="$separator"/>
      <xsl:value-of select="translate($n1,'.',$separator)"/>
    </xsl:if>
    <xsl:if test="$n2 != ''">
      <xsl:value-of select="$separator"/>
      <xsl:value-of select="translate($n2,'.',$separator)"/>
    </xsl:if>
    <xsl:if test="$n3 != ''">
      <xsl:value-of select="$separator"/>
      <xsl:value-of select="translate($n3,'.',$separator)"/>
    </xsl:if>
  </xsl:template>

  <!-- WORK-ABBREV !-->
  <xsl:template name="work-abbrev">
    <xsl:param name="encoding"/>
    <xsl:choose>
      <xsl:when test="$encoding = 'ASCII'">
	<xsl:text>MaMa</xsl:text>
      </xsl:when>
      <xsl:otherwise>
	<xsl:text>MāMā</xsl:text>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
